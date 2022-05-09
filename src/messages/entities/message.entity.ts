import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Option } from './option.entity';

export type MessageDocument = Message & Document;

@Schema({
    timestamps: true
})
export class Message {

    @Prop({ required: true })
    message: string;

    @Prop([{ type: Option }])
    options?: Option[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

