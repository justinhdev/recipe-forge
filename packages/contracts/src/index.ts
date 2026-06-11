// Shared API request/response shapes used by the web and mobile clients.

export type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  token: string;
  name: string;
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

export type FoodLog = {
  id: number;
  userId: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type DailyTarget = {
  id: number;
  userId: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateFoodLogRequest = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt?: string;
};

export type ListFoodLogsQuery = {
  date: string;
};

export type CreateFoodLogResponse = FoodLog;
export type ListFoodLogsResponse = FoodLog[];
export type DeleteFoodLogResponse = {
  message: string;
};

export type GetDailyTargetResponse = DailyTarget | null;
export type UpdateDailyTargetRequest = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
export type UpdateDailyTargetResponse = DailyTarget;
