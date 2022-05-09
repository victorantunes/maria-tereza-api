import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateSchedulerDto } from './create-scheduler.dto';
import { ContactDocument } from '../../contacts/entities/contact.entity';

export class UpdateSchedulerDto extends PartialType(CreateSchedulerDto) {
    @IsNotEmpty()
    readonly _id: string;

    @IsNotEmpty()
    readonly sentToContact: ContactDocument;
}
