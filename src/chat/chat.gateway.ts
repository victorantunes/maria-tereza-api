import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
const fs = require('fs')

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('create')
  async handleCreate(client: Socket, payload: string) {
    this.logger.log(`EVENT:create received`);
    return this.server.emit('create', { 'clientId': client.id });
  }

  @SubscribeMessage('close')
  async handleClose(client: Socket, payload: string) {
    this.logger.log(`EVENT:close received ${payload}`);
    return this.server.emit('close', payload);
  }


  @SubscribeMessage('sendText')
  async handleSendText(client: Socket, payload: { to: [string], message: string }) {
    payload['clientId'] = client.id;
    this.logger.log(`EVENT:sendText received, payload: ${JSON.stringify(payload)}`);
    this.server.emit('sendText', payload);
  }

  @SubscribeMessage('qrCode')
  async handleQrCode(client: Socket, payload: { clientId: string, base64Qr: string }) {
    this.logger.log(`EVENT:qrCode received, clientId: ${payload.clientId}`);

    var matches = payload.base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response['type'] = matches[1];
    response['data'] = Buffer.from(matches[2], 'base64');

    var imageBuffer = response;
    fs.writeFile(
      `tokens/qrCode-${payload.clientId}.png`,
      imageBuffer['data'],
      'binary',
      function (err) {
        if (err != null) {
          console.log(err);
        }
      }
    );

    this.server.to(payload.clientId).emit('qrCode', payload);
  }

  @SubscribeMessage('qrCodeAck')
  async handleQrCodeAcl(client: Socket, payload: { clientId: string }) {
    this.logger.log(`EVENT:qrCodeAck, ${JSON.stringify(payload)}`);

    this.server.to(payload.clientId).emit('qrCodeAck', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
