import { CartItem } from './cart-item.model';

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
}