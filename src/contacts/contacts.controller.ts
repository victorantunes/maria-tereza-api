import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findById(id);
  }

  // @Put()
  // update(@Body() updateContactDto: UpdateContactDto) {
  //   return this.contactsService.update(updateContactDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.contactsService.deleteById(id);
  // }
}
