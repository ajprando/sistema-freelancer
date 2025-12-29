import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ContadorService } from './contador.service';
import { IncrementContadorDto } from './dto/increment-contador.dto';
import { ContadorResponseDto } from './dto/contador-response.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ContadorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly contadorService: ContadorService) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);

    const value = this.contadorService.getValue();
    client.emit('contadorUpdated', {
      value,
      timestamp: new Date(),
    } as ContadorResponseDto);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('increment')
  handleIncrement(
    client: Socket,
    payload: IncrementContadorDto,
  ): ContadorResponseDto {
    const amount = payload.amount || 1;
    const value = this.contadorService.increment(amount);

    const response: ContadorResponseDto = {
      value,
      timestamp: new Date(),
    };

    this.server.emit('contadorUpdated', response);

    return response;
  }

  @SubscribeMessage('getValue')
  handleGetValue(): ContadorResponseDto {
    const value = this.contadorService.getValue();

    return {
      value,
      timestamp: new Date(),
    };
  }

  @SubscribeMessage('reset')
  handleReset(): ContadorResponseDto {
    const value = this.contadorService.reset();

    const response: ContadorResponseDto = {
      value,
      timestamp: new Date(),
    };

    this.server.emit('contadorUpdated', response);

    return response;
  }
}
