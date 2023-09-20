interface Transaction {
  amount: number;
  event?: string;
}


interface People {
  name: string;
  amountToPay: number;
}

type ExpenseSummary = People[];
type PeopleAction = {
  action: 'pay' | 'receive';
  amount: number;
  toPerson: string;
}

interface PeopleExpense {
  name: string;
  actions: PeopleAction[]
}
type ExpenseMap = PeopleExpense[]
