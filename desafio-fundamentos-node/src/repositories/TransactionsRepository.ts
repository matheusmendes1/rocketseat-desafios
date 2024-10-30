import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const transactionsTypeIncome = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((accumulator, transaction) => {
        return accumulator + transaction.value;
      }, 0);

    const transactionsTypeOutcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((accumulator, transaction) => {
        return accumulator + transaction.value;
      }, 0);

    const totalTransactions = transactionsTypeIncome - transactionsTypeOutcome;

    return {
      income: transactionsTypeIncome,
      outcome: transactionsTypeOutcome,
      total: totalTransactions,
    };
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
