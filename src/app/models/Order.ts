import { User } from "../core/models/auth.models";
import { OrderDetail } from "./OrderDetail";
import { StatusModel } from "./StatusModel";
import { Table } from "./Table";

export interface Order {
  id: string;
  observation?: string;
  resume: string;
  code: string;
  type: any;
  total: number;
  table: Table;
  state: string;
  orderDetails: OrderDetail[];
  user: User;
  status: StatusModel;
}
