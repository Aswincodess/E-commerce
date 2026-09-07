import { CartItem } from "./cart-item.model";

export interface Order {
    id: number;
    userId: number;
    items: CartItem[];
    total:number;
    status: 'pending' | 'confirmed' | 'delivered';
}
