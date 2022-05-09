import { Body, Controller, Post } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

// import { ApiProperty } from '@nestjs/swagger';

// export class DSendTextReq {
//   @ApiProperty()
//   to: [string];

//   @ApiProperty()
//   message: string;
// }

@Controller('chat')
export class ChatController {
  constructor(private gateway: ChatGateway) { }


  @Post('create')
  create(): boolean {
    return this.gateway.server.emit('create');
  }

  // @Post()
  // send(@Body('message') message: string): boolean {
  //   return this.gateway.server.emit('message', {
  //     message,
  //     to: '5511900000000',
  //   });
  // }
}

class TextMessage {


}