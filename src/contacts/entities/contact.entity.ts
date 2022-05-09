import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;


@Schema({
    timestamps: true
})
export class Contact {

    @Prop({ required: true })
    name: string;


    @Prop({
        required: true,
        unique: true,
        match: /\d{2}\d{2}\d{4,5}\d{4}/
    })
    phoneNumber: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);