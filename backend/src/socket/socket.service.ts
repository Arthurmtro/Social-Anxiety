import { userType } from './../types/user.type';
import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@Injectable()
export class SocketService {
  handleMessage(
    activeSockets: userType[],
    server: Server,
    client: Socket,
    payload: string,
  ) {
    const associedSocket = activeSockets.find(
      (socket) => socket.id === client.id,
    );

    if (!associedSocket) return;

    const username = associedSocket.username;

    server.emit('messageChannel', {
      authorId: client.id,
      name: username,
      text: payload,
    });
  }

  callUser(
    server: Server,
    client: Socket,
    payload: { to: string; offer: any },
  ) {
    console.log('payload', payload);
    server.to(payload.to).emit('callMade', {
      offer: payload.offer,
      socket: client.id,
    });
  }

  makeAnswer(
    server: Server,
    client: Socket,
    payload: { to: string; answer: any },
  ) {
    server.to(payload.to).emit('answerMade', {
      answer: payload.answer,
      socket: client.id,
    });
  }

  setUsername(
    logger,
    activeSockets: userType[],
    client: Socket,
    username: string,
  ) {
    logger.log(`set username for ${client.id} : ${username}`);

    const existingSocket = activeSockets.find(
      (existingSocket) => existingSocket.id === client.id,
    );

    if (!existingSocket) return;

    existingSocket.username = username;

    activeSockets = activeSockets.filter(
      (existingSocket) => existingSocket.id !== client.id,
    );

    activeSockets.push(existingSocket);

    client.emit('accessToChatroom', {
      users: activeSockets,
    });

    client.emit('updateUserList', {
      users: activeSockets,
    });

    client.broadcast.emit('updateUserList', {
      users: activeSockets,
    });

    return activeSockets;
  }

  afterInit(logger: Logger) {
    logger.log('Init');
  }

  handleConnection(logger, activeSockets: userType[], client) {
    logger.log(`Client connected: ${client.id}`);

    const existingSocket = activeSockets.find(
      (existingSocket) => existingSocket === client.id,
    );

    if (!existingSocket) {
      activeSockets.push({ id: client.id });

      client.emit('updateUserList', {
        users: activeSockets,
      });

      client.broadcast.emit('updateUserList', {
        users: activeSockets,
      });
    }
  }

  handleDisconnect(logger: Logger, activeSockets: userType[], client: Socket) {
    logger.log(`Client disconnected: ${client.id}`);

    activeSockets = activeSockets.filter(
      (existingSocket) => existingSocket.id !== client.id,
    );
    client.broadcast.emit('removeUser', {
      socketId: [client.id],
    });

    return activeSockets;
  }
}
