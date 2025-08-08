import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { DataSource } from 'typeorm';
import { createRecipeRepository } from './recipe.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  providers: [
    RecipeService,
    {
      provide: 'RecipeRepository',
      useFactory: (dataSource: DataSource) =>
        createRecipeRepository(dataSource),
      inject: [DataSource],
    },
  ],
  controllers: [RecipeController],
})
export class RecipesModule {}
