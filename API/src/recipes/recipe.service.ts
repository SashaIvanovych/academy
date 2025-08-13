import { Injectable, Inject } from '@nestjs/common';
import {
  CreateRecipeDto,
  UpdateRecipeDto,
  GetRecipesQueryDto,
} from './recipe.dto';
import type { RecipeRepositoryType } from './recipe.repository';

@Injectable()
export class RecipeService {
  constructor(
    @Inject('RecipeRepository')
    private recipeRepository: RecipeRepositoryType,
  ) {}

  async createRecipe(dto: CreateRecipeDto, authorId: string) {
    return this.recipeRepository.createRecipe(dto, authorId);
  }

  async getRecipes(query: GetRecipesQueryDto) {
    const { search, limit, offset, authorId } = query;
    return this.recipeRepository.findAll(search, limit, offset, authorId);
  }

  async getRecipeById(id: string) {
    return this.recipeRepository.findById(id);
  }

  async updateRecipe(id: string, dto: UpdateRecipeDto, userId: string) {
    return this.recipeRepository.updateRecipe(id, dto, userId);
  }

  async deleteRecipe(id: string, userId: string) {
    return this.recipeRepository.deleteRecipe(id, userId);
  }
}
