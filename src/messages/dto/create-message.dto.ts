import { IsNotEmpty } from "class-validator";
import { OptionDocument } from '../entities/option.entity';

export class CreateMessageDto {
    @IsNotEmpty()
    readonly message: string;

    readonly options?: OptionDocument[];
}
