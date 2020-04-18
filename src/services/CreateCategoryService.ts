import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateTransactionService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const categoryExistent = await categoryRepository.findOne({
      where: { title },
    });

    if (categoryExistent) {
      return categoryExistent;
    }

    const newCategory = categoryRepository.create({
      title,
    });

    await categoryRepository.save(newCategory);

    return newCategory;
  }
}

export default CreateTransactionService;
