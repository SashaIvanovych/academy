import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Unit } from './recipe.entity';

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsEnum(Unit)
  unit: Unit;
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsNotEmpty()
  ingredients: IngredientDto[];
}

export class UpdateRecipeDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsOptional()
  ingredients?: IngredientDto[];
}

export class GetRecipesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}

export class GetRecipeByIdParamDto {
  @IsUUID()
  id: string;
}
