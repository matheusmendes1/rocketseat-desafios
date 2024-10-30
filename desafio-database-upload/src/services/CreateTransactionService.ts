import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateCategoryService from './CreateCategoryService';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionReposity = getCustomRepository(TransactionsRepository);
    const createCategoryService = new CreateCategoryService();
    const balance = await transactionReposity.getBalance();

    const newCategory = await createCategoryService.execute({
      title: category,
    });

    if (type === 'outcome') {
      if (balance.total - value < 0) {
        throw new AppError('Balance error');
      }
    }

    const transaction = transactionReposity.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionReposity.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
