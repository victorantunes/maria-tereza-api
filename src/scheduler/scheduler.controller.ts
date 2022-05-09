import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createSchedulerDto: CreateSchedulerDto) {
    return this.schedulerService.create(createSchedulerDto);
  }

  @Get()
  findAll() {
    return this.schedulerService.findNextMessage();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulerService.findById(id);
  }

  @Put()
  @UsePipes(ValidationPipe)
  update(@Body() updateSchedulerDto: UpdateSchedulerDto) {
    return this.schedulerService.update(updateSchedulerDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.schedulerService.deleteById(id);
  // }
}
