import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Could not find the transaction');
    }

    await transactionRepository.delete(transaction.id);
  }
}

export default DeleteTransactionService;
