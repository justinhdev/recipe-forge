// TODO: client/src/types/contracts.ts should eventually migrate here.
// Keep this package lightweight so the web client and future mobile app can share API shapes.

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
