import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ContactDocument } from '../../contacts/entities/contact.entity';
import { Message, MessageDocument } from '../../messages/entities/message.entity';
import { Contact } from '../../contacts/entities/contact.entity';

export type SchedulerDocument = Scheduler & Document;

@Schema({
    timestamps: true
})
export class Scheduler {

    @Prop({ required: true })
    when: Date;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Message.name
    })
    message: MessageDocument;

    @Prop([{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Contact.name
    }])
    sendToContact: ContactDocument[];

    @Prop([{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Contact.name
    }])
    sentToContact: ContactDocument[];

}

export const SchedulerSchema = SchemaFactory.createForClass(Scheduler);