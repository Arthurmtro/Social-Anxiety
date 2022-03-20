import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [SocketModule],
})
export class AppModule {}
