export class Person {
  public receiveActions: Map<string, Transaction> = new Map();
  public payActions: Map<string, Transaction> = new Map();
  public amountToPay: number = 0;

  constructor(public name: string, public readonly paid: number) {
    if (paid > 0) {
      this.amountToPay = -paid;
    }
  }

  addAmountToPay(amount: number) {
    this.amountToPay = amount;
  }

  pay(amount: number, person: string) {
    let payAmount = amount;
    if (this.amountToPay < amount) {
      payAmount = amount - this.amountToPay;
    }
    this.payActions.set(person, {
      amount: parseAmount(payAmount),
    });
    this.amountToPay -= payAmount;
    return payAmount;
  }

  receive(amount: number, person: string) {
    this.amountToPay += amount;
    this.receiveActions.set(person, {
      amount: parseAmount(amount),
    });
  }

  getAmountToPay() {
    return Number(this.amountToPay.toFixed(2))
  }
}

function parseAmount(amount: number) {
  return Number(amount.toFixed(2))
}