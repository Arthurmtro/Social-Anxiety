import { userType } from './../types/user.type';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

// Service
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: Server;

  private readonly socketService: SocketService;
  private activeSockets: userType[];
  private logger: Logger;

  constructor() {
    this.logger = new Logger('socketGateway');
    this.socketService = new SocketService();
    this.activeSockets = [];
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.socketService.handleMessage(
      this.activeSockets,
      this.server,
      client,
      payload,
    );
  }

  @SubscribeMessage('callUser')
  callUser(client: Socket, payload: { to: string; offer: any }): void {
    this.socketService.callUser(this.server, client, payload);
  }

  @SubscribeMessage('makeAnswer')
  makeAnswer(client: Socket, payload: { to: string; answer: any }): void {
    this.socketService.makeAnswer(this.server, client, payload);
  }

  @SubscribeMessage('setUsername')
  setUsername(client: Socket, username: string): void {
    this.activeSockets = this.socketService.setUsername(
      this.logger,
      this.activeSockets,
      client,
      username,
    );
  }

  afterInit(server: Server) {
    this.socketService.afterInit(this.logger);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.socketService.handleConnection(
      this.logger,
      this.activeSockets,
      client,
    );
  }

  handleDisconnect(client: Socket) {
    this.activeSockets = this.socketService.handleDisconnect(
      this.logger,
      this.activeSockets,
      client,
    );
  }
}
