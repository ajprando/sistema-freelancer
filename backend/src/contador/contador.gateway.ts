import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ContadorService } from './contador.service';

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

  constructor(private readonly counterService: ContadorService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway inicializado');
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);

    const startTime = this.counterService.getStartTime();
    if (startTime) {
      client.emit('timerStarted', { startTime: startTime.toISOString() });
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('startTimer')
  handleStartTimer(client: Socket) {
    const startTime = this.counterService.startTimer();

    const response = {
      startTime: startTime.toISOString(),
    };

    this.server.emit('timerStarted', response);
  }

  @SubscribeMessage('stopTimer')
  handleStopTimer(client: Socket) {
    const stoppedTime = this.counterService.stopTimer();

    const response = {
      stoppedTime: stoppedTime ? stoppedTime.toISOString() : null,
    };

    this.server.emit('timerStopped', response);
  }
}
