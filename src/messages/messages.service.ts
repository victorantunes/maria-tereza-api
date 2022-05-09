import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from "mongodb";
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageDocument } from './entities/message.entity';

@Injectable()
export class MessagesService {
  protected readonly logger = new Logger(MessagesService.name);
  constructor(@InjectModel(Message.name) protected readonly model: Model<MessageDocument>) { }

  async findById(_id: string): Promise<MessageDocument> {
    this.logger.log(`findById: ${_id}`);
    return this.model.findById(_id).populate('options.redirect').exec();
  }

  async findAll(): Promise<MessageDocument[]> {
    this.logger.log('findAll');
    return this.model.find().exec();
  }

  async deleteById(_id: string): Promise<DeleteResult> {
    this.logger.log(`deleteById: ${_id}`);
    return this.model.deleteOne({ _id }).exec();
  }

  async create(param: CreateMessageDto): Promise<MessageDocument> {
    this.logger.log(`create: ${JSON.stringify(param)}`);
    return this.model.create(param);
  }

  async update(param: UpdateMessageDto): Promise<MessageDocument> {
    this.logger.log(`update:  ${JSON.stringify(param)}`);
    return this.model.findByIdAndUpdate(param._id, { $set: param }).exec();
  }
}