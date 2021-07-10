import { Category } from "./CategoryBodyRequestDto";

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  categories: Category[];
}
