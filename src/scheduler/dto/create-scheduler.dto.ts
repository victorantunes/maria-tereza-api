import { IsNotEmpty, ArrayMinSize } from "class-validator";
import { ContactDocument } from "src/contacts/entities/contact.entity"
import { MessageDocument } from "src/messages/entities/message.entity"

export class CreateSchedulerDto {
    @IsNotEmpty()
    readonly when: Date;

    @IsNotEmpty()
    readonly message: MessageDocument;

    @IsNotEmpty()
    @ArrayMinSize(1)
    readonly sendToContact: ContactDocument[];
}

