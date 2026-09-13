import { OrderItem } from './order-item.model';

export interface Order {

  id: string;

  userId: string;

  items: OrderItem[];

  total: number;

  fullName: string;

  phone: string;

  addressLine: string;

  city: string;

  state: string;

  pincode: string;

  paymentMethod: 'COD' | 'UPI' | 'CARD';

  status:
  | 'pending'
  | 'confirmed'
  | 'delivered'
  | 'cancelled';

  createdAt: string;

}