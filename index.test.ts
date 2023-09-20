import { test, expect, describe } from 'bun:test';
import { calculateExpenseSplitSummary, splitCost } from '.';
import { Person } from './entity';

test('Scenario 1', () => {
  const people: Person[] = [new Person('john', 60), new Person('ben', 0), new Person('mark', 0)];
  expect(splitCost(people)).toBeArray();
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

test('Scenario 2', () => {
  const people: Person[] = [new Person('john', 30), new Person('ben', 30), new Person('mark', 0)];
  expect(splitCost(people)).toBeArray();
  expect(splitCost(people)).toEqual([
    {
      name: 'john',
      amountToPay: -10,
    },
    {
      name: 'ben',
      amountToPay: -10,
    },
    {
      name: 'mark',
      amountToPay: 20,
    },
  ]);
});

test('scenario 3', () => {
  const people: Person[] = [new Person('john', 30), new Person('ben', 30), new Person('mark', 0)];

  expect(calculateExpenseSplitSummary(people).every((person) => person.amountToPay === 0)).toBeTrue();
  expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.payActions).toBeEmpty();
  expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.payActions).toBeEmpty();
  expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.payActions).toEqual(
    new Map([
      ['john', { amount: 10 }],
      ['ben', { amount: 10 }],
    ])
  );

  expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'mark')?.receiveActions).toBeEmpty();
  expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'ben')?.receiveActions).toEqual(new Map([['mark', { amount: 10 }]]));
  expect(calculateExpenseSplitSummary(people).find((person) => person.name === 'john')?.receiveActions).toEqual(new Map([['mark', { amount: 10 }]]));
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
