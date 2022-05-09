import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Scheduler, SchedulerSchema } from './entities/scheduler.entity';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { ChatModule } from '../chat/chat.module';
import { ContactsModule } from '../contacts/contacts.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    MongooseModule.forFeature([{ name: Scheduler.name, schema: SchedulerSchema }]), 
    ChatModule,
    ContactsModule
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService]
})
export class SchedulerModule { }
