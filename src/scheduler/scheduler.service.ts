import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ContactDocument } from 'src/contacts/entities/contact.entity';
import { MessageDocument } from 'src/messages/entities/message.entity';
import { ContactsService } from '../contacts/contacts.service';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';
import { Scheduler, SchedulerDocument } from './entities/scheduler.entity';

@Injectable()
export class SchedulerService {
  protected readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectModel(Scheduler.name) protected readonly model: Model<SchedulerDocument>,
    private chatGateway: ChatGateway,
    private contactsService: ContactsService,
  ) { }

  async findById(_id: string): Promise<SchedulerDocument> {
    this.logger.log(`findById: ${_id}`);
    return this.model.findById(_id).populate('options.redirect').exec();
  }

  async findAll(): Promise<SchedulerDocument[]> {
    this.logger.log('findAll');
    return this.model.find().exec();
  }

  async findNextMessage(): Promise<SchedulerDocument[]> {
    this.logger.log('findNextMessage');
    return this.model.find({
      when: { $lte: new Date().toISOString() },
      $expr: {
        $lte: [
          { $size: "$sentToContact" },
          { $size: "$sendToContact" }
        ]
      }
    })
      .sort({ when: 1 })
      .limit(1)
      .populate('message')
      .exec();
  }

  async deleteById(_id: string): Promise<DeleteResult> {
    this.logger.log(`deleteById: ${_id}`);
    return this.model.deleteOne({ _id }).exec();
  }

  async create(param: CreateSchedulerDto): Promise<SchedulerDocument> {
    this.logger.log(`create: ${JSON.stringify(param)}`);
    return this.model.create(param);
  }

  async update(param: UpdateSchedulerDto): Promise<SchedulerDocument> {
    const schedule = await this.findById(param._id);
    const { sendToContact, sentToContact } = schedule;

    const contactInSendList = sendToContact.findIndex((contact) => {
      return contact._id == param.sentToContact
    });

    const contactInSentList = sentToContact.findIndex((contact) => {
      return contact._id == param.sentToContact
    });

    if (contactInSendList >= 0 && contactInSentList < 0) {
      this.logger.log(`update:  ${JSON.stringify(param)}`);
      return this.model.findByIdAndUpdate(param._id, { $push: { "sentToContact": param.sentToContact } }).exec();
    } else {
      throw new BadRequestException('Invalid Contact');
    }
  }

  @Cron(`0 */5 * * * *`)
  async handleCron() {
    const nextMessage = await this.findNextMessage();
    if (nextMessage.length > 0) {
      const { message, sendToContact, sentToContact } = nextMessage[0];
      const toContact = await this.getContact(sendToContact, sentToContact);
      await this.awaitToSend();
      await this.sendMessage(message, toContact, nextMessage);
    }
  }

  private async sendMessage(message: MessageDocument, toContact: ContactDocument, nextMessage: SchedulerDocument[]) {
    const _message = { message: message, to: toContact.phoneNumber };
    this.logger.log(`sendMessage: ${_message}`);
    this.chatGateway.server.emit('message', _message);
    await this.update({
      _id: nextMessage[0]._id,
      sentToContact: toContact
    });
  }

  private async awaitToSend() {
    const seconds = this.randomIntFromInterval(0, 299);
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  private async getContact(sendToContact: ContactDocument[], sentToContact: ContactDocument[]): Promise<ContactDocument> {
    const contactId = sendToContact.filter(contact => {
      return sentToContact.indexOf(contact) < 0;
    })[0];
    return this.contactsService.findById(contactId._id);
  }

  private randomIntFromInterval(min, max): number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}



