import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from "mongodb";
import { Model } from 'mongoose';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact, ContactDocument } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  protected readonly logger = new Logger(ContactsService.name);
  constructor(@InjectModel(Contact.name) protected readonly model: Model<ContactDocument>) { }

  async findById(_id: string): Promise<ContactDocument> {
    this.logger.log(`findById: ${_id}`);
    return this.model.findById(_id).exec();
  }

  async findAll(): Promise<ContactDocument[]> {
    this.logger.log('findAll');
    return this.model.find().exec();
  }

  async deleteById(_id: string): Promise<DeleteResult> {
    this.logger.log(`deleteById: ${_id}`);
    return this.model.deleteOne({ _id }).exec();
  }

  async create(param: CreateContactDto): Promise<ContactDocument> {
    this.logger.log(`create: ${JSON.stringify(param)}`);
    return this.model.create(param);
  }

  async update(param: UpdateContactDto): Promise<ContactDocument> {
    this.logger.log(`update:  ${JSON.stringify(param)}`);
    return this.model.findByIdAndUpdate(param._id, { $set: param }).exec();
  }
}
