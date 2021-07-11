import { Order } from "./Order";

export class Table {
  id: string;
  name: string;
  state: string;
  orders: Order[];
}
