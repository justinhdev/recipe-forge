export type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type Recipe = {
  id?: number;
  title: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  createdAt?: string;
};

export type GenerateOptions = {
  servings: number;
  diet: string;
  cuisine: string;
  mealType: string;
  bravery: number;
  macroPreference: string;
};

export type GenerateRecipeRequest = {
  ingredients: string[];
} & GenerateOptions;

export type GenerateRecipeResponse = Recipe;
export type SaveRecipeRequest = Recipe;
