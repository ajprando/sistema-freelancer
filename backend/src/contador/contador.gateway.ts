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
    transports: ['websocket', 'polling'],
    cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
})
export class ContadorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly contadorService: ContadorService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway inicializado');
  }

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
  handleIncrement(client: Socket, payload: any) {
    console.log(`Incrementando contador...`, payload);
    const amount = payload?.amount || 1;
    const value = this.contadorService.increment(amount);
  
    const response: ContadorResponseDto = {
      value,
      timestamp: new Date(),
    };

    console.log(`Emitindo contadorUpdated:`, response);

    this.server.emit('contadorUpdated', response);

    return response;
  }

  @SubscribeMessage('getValue')
  handleGetValue(client: Socket) { 
    const value = this.contadorService.getValue();

    return {
      value,
      timestamp: new Date(),
    };
  }

  @SubscribeMessage('reset')
  handleReset(client: Socket) {
    console.log(`Resetando contador...`);
    const value = this.contadorService.reset();

    const response: ContadorResponseDto = {
      value,
      timestamp: new Date(),
    };

    console.log(`Emitindo contadorUpdated:`, response);

    this.server.emit('contadorUpdated', response);

  }
}
