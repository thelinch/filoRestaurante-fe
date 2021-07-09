import { OrderDetail } from "./OrderDetail";
import { Table } from "./Table";

export interface Order {
   id: string;
   observation?: string;
   resume: string;
   total: number;
   table: Table;

   orderDetails: OrderDetail[];
}
