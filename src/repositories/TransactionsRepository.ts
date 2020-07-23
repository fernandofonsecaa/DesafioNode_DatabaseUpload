import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomes = await this.find({
      where: { type: 'income' },
    });

    const totalIncome = incomes.reduce((sum, incomeValue) => {
      return sum + Number(incomeValue.value);
    }, 0);

    const outcomes = await this.find({
      where: { type: 'outcome' },
    });

    const totalOutcome = outcomes.reduce((sum, outcomeValue) => {
      return sum + Number(outcomeValue.value);
    }, 0);

    const fullTotal = totalIncome - totalOutcome;

    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: fullTotal,
    };

    return balance;
  }
}

export default TransactionsRepository;

/* Solução utilizando Switch Case
public async getBalance(): Promise<Balance> {
  const transactions = await this.find();

  const { income, outcome } = transactions.reduce(
    (accumulator, transaction) =>{
      switch (transaction.type){
        case 'income':
          accumulator.income += transaction.value;
          break;

        case 'outcome':
          accumulator.outcome += transaction.value;
          break;

          default:
            break;
      }
      return accumulator;
    },

    {
      income:0,
      outcome:0,
      total:0
    },

      }
    }
  )


*/
