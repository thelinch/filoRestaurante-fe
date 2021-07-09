import { Product } from './Product';

export interface OrderDetail {
   id: string;
   product: Product;
   orderedQuantity: number;
}
