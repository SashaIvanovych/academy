import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import {
  CreateRecipeDto,
  UpdateRecipeDto,
  GetRecipesQueryDto,
  GetRecipeByIdParamDto,
} from './recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRecipe(@Body() dto: CreateRecipeDto, @Request() req) {
    const recipe = await this.recipeService.createRecipe(dto, req.user.id);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Recipe created successfully',
      data: recipe,
      error: null,
    };
  }

  @Get()
  async getRecipes(@Query() query: GetRecipesQueryDto) {
    const { recipes, total } = await this.recipeService.getRecipes(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recipes retrieved successfully',
      data: { recipes, total },
      error: null,
    };
  }

  @Get(':id')
  async getRecipeById(@Param() param: GetRecipeByIdParamDto) {
    const recipe = await this.recipeService.getRecipeById(param.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recipe retrieved successfully',
      data: recipe,
      error: null,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateRecipe(
    @Param() param: GetRecipeByIdParamDto,
    @Body() dto: UpdateRecipeDto,
    @Request() req,
  ) {
    const recipe = await this.recipeService.updateRecipe(
      param.id,
      dto,
      req.user.id,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Recipe updated successfully',
      data: recipe,
      error: null,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRecipe(@Param() param: GetRecipeByIdParamDto, @Request() req) {
    await this.recipeService.deleteRecipe(param.id, req.user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recipe deleted successfully',
      data: null,
      error: null,
    };
  }
}
