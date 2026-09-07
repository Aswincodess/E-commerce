import { CartItem } from "../../core/models/cart-item.model";

export interface CartState {
    cartId: number | null;
    userId: number | null;
    items: CartItem[];
    loading:boolean;
    error: string | null;
}

export const initialCartState: CartState ={
    cartId: null,
    userId: null,
    items: [],
    loading: false,
    error: null
}