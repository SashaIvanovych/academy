import { DataSource, Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './recipe.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export type RecipeRepositoryType = {
  createRecipe: (dto: CreateRecipeDto, authorId: string) => Promise<Recipe>;
  findAll: (
    search?: string,
    limit?: number,
    offset?: number,
  ) => Promise<{ recipes: Recipe[]; total: number }>;
  findById: (id: string) => Promise<Recipe>;
  updateRecipe: (
    id: string,
    dto: UpdateRecipeDto,
    userId: string,
  ) => Promise<Recipe>;
  deleteRecipe: (id: string, userId: string) => Promise<void>;
};

export const createRecipeRepository = (
  dataSource: DataSource,
): RecipeRepositoryType => {
  const repository = dataSource.getRepository(Recipe);

  const createRecipe = async (dto: CreateRecipeDto, authorId: string) => {
    const recipe = repository.create({ ...dto, authorId });
    return repository.save(recipe);
  };

  const findAll = async (search?: string, limit = 10, offset = 0) => {
    const query = repository
      .createQueryBuilder('recipe')
      .select([
        'recipe.id',
        'recipe.title',
        'recipe.image',
        'recipe.content',
        'recipe.ingredients',
        'recipe.authorId',
        'recipe.createdAt',
      ])
      .orderBy('recipe.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (search) {
      query.where('recipe.title ILIKE :search', { search: `%${search}%` });
    }

    const [recipes, total] = await query.getManyAndCount();
    return { recipes, total };
  };

  const findById = async (id: string) => {
    const recipe = await repository.findOne({
      where: { id },
      select: {
        id: true,
        title: true,
        image: true,
        content: true,
        ingredients: true,
        authorId: true,
        createdAt: true,
      },
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    return recipe;
  };

  const updateRecipe = async (
    id: string,
    dto: UpdateRecipeDto,
    userId: string,
  ) => {
    const recipe = await repository.findOneBy({ id, authorId: userId });
    if (!recipe) {
      throw new NotFoundException('Recipe not found or you are not authorized');
    }
    return repository.save({ ...recipe, ...dto });
  };

  const deleteRecipe = async (id: string, userId: string) => {
    const result = await repository.delete({ id, authorId: userId });
    if (result.affected === 0) {
      throw new NotFoundException('Recipe not found or you are not authorized');
    }
  };

  return { createRecipe, findAll, findById, updateRecipe, deleteRecipe };
};
