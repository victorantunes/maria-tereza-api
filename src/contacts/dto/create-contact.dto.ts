import { IsNotEmpty, Validate } from "class-validator";
import { ValidationPhoneNumberPipe } from "src/common/pipes/validation-phone-number.pipe";

export class CreateContactDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @Validate(ValidationPhoneNumberPipe)
    readonly phoneNumber: string;
}
