import { Injectable } from '@nestjs/common';

@Injectable()
export class ContadorService {
  private startTime: Date | null = null;

  startTimer(): Date {
    this.startTime = new Date();
    return this.startTime;
  }

  stopTimer(): Date | null {
    const stoppedTime = this.startTime;
    this.startTime = null;
    return stoppedTime;
  }

  getStartTime(): Date | null {
    return this.startTime;
  }
}
