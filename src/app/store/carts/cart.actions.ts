import { createAction, props } from '@ngrx/store';

import { products } from '../../core/models/product.model';
import { CartItem } from '../../core/models/cart-item.model';

export const loadCart = createAction(
    '[Cart] Load Cart',
    props<{ userId: string }>()
);

export const loadCartSuccess = createAction(
    '[Cart] Load Cart Success',
    props<{
        cartId: string;
        userId: string;
        items: CartItem[];
    }>()
);

export const loadCartFailure = createAction(
    '[Cart] Load Cart Failure',
    props<{ error: string }>()
);

export const setCartId = createAction(
    '[Cart] Set Cart ID',
    props<{ cartId: string }>()
);

export const addToCart = createAction(
    '[Cart] Add To Cart',
    props<{ product: products }>()
);

export const removeFromCart = createAction(
    '[Cart] Remove From Cart',
    props<{ productId: number }>()
);

export const increaseQuantity = createAction(
    '[Cart] Increase Quantity',
    props<{ productId: number }>()
);

export const decreaseQuantity = createAction(
    '[Cart] Decrease Quantity',
    props<{ productId: number }>()
);

export const clearCart = createAction(
    '[Cart] Clear Cart'
);
export const resetCart = createAction(
    '[Cart] Reset Cart'
);