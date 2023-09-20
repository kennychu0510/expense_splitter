import { test, expect, describe } from 'bun:test';
import { calculateExpenseSplitSummary, splitCost } from '.';
import { Person } from './entity';

describe('split cost function', () => {
  const people: Person[] = [new Person('john', 60), new Person('ben', 0), new Person('mark', 0)];
  test('returns an array', () => {
    expect(splitCost(people)).toBeArray();
  });
  test('content is correct', () => {
    expect(splitCost(people)).toEqual([
      {
        name: 'john',
        amountToPay: -40,
      },
      {
        name: 'ben',
        amountToPay: 20,
      },
      {
        name: 'mark',
        amountToPay: 20,
      },
    ]);
  });

})

describe('scenario 3', () => {
  const people: Person[] = [new Person('john', 30), new Person('ben', 30), new Person('mark', 0)];

  test('amount is settled', () => {
    expect(calculateExpenseSplitSummary(people).every((person) => person.amountToPay === 0)).toBeTrue();
  })

  test("john and ben don't need to pay", () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.payActions).toBeEmpty();
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.payActions).toBeEmpty();
  })

  test('mark pays john and ben $10', () =>{ 
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.payActions).toEqual(
      new Map([
        ['john', { amount: 10 }],
        ['ben', { amount: 10 }],
      ])
    );
  })

  test('john and ben each receive $10 from mark', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.receiveActions).toBeEmpty();
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.receiveActions).toEqual(new Map([['mark', { amount: 10 }]]));
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.receiveActions).toEqual(new Map([['mark', { amount: 10 }]]));
  })

});

describe('Scenario 4', () => {
  const people: Person[] = [new Person('john', 30), new Person('ben', 0), new Person('mark', 0)];
  test('amount is settled', () => {
    expect(calculateExpenseSplitSummary(people).every((person) => person.amountToPay === 0)).toBeTrue();
  });

  test('ben pays john $10', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.payActions).toEqual(new Map([['john', { amount: 10 }]]));
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.receiveActions).toBeEmpty()
  });

  test('mark pays john $10', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.payActions).toEqual(new Map([['john', { amount: 10 }]]));
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.receiveActions).toBeEmpty()
  });

  test('john receives $10 from ben and mark', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.receiveActions).toEqual(new Map([['mark', { amount: 10 }], ['ben', { amount: 10 }]]));
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.payActions).toBeEmpty();
  });
});

describe('Scenario 5', () => {
  const people: Person[] = [new Person('john', 10), new Person('ben', 0), new Person('mark', 0)];
  test.only('amount is settled', () => {
    expect(calculateExpenseSplitSummary(people).every((person) => Math.round(person.amountToPay) === 0)).toBeTrue();
  });

  test('ben pays john $3.33', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.payActions).toEqual(new Map([['john', { amount: 3.33 }]]));
    // expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.receiveActions).toBeEmpty()
  });

  test('mark pays john $3.33', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.payActions).toEqual(new Map([['john', { amount: 3.33 }]]));
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.receiveActions).toBeEmpty()
  });

  test('john receives $6.66 from ben and mark', () => {
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.receiveActions).toEqual(new Map([['mark', { amount: 3.33 }], ['ben', { amount: 3.33 }]]));
    expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.payActions).toBeEmpty();
  });
});
