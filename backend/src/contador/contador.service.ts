import { Injectable } from '@nestjs/common';

@Injectable()
export class ContadorService {
  private value: number = 0;

  increment(amount: number = 1): number {
    this.value += amount;
    return this.value;
  }

  getValue(): number {
    return this.value;
  }

  reset(): number {
    this.value = 0;
    return this.value;
  }
}
