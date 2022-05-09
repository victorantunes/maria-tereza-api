import { Prop, Schema } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MessageDocument } from "./message.entity";

export type OptionDocument = Option & Document;

@Schema()
export class Option {

    @Prop({ required: true })
    displayText: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    })
    redirect: MessageDocument;
}