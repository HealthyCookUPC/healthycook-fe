import { IngredientTypes } from "./ingredient-types";

export class RecipeDetails {
    recipeId?: number;
    preparationTime: number;
    servings: number;
    difficulty: number;

    constructor(preparationTime: number,servings: number, difficulty: number) {
        this.preparationTime = preparationTime;
        this.servings = servings;
        this.difficulty = difficulty;
    }
}