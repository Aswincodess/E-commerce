import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CartState } from './cart.state';

import { selectAllProducts } from '../products/products.selectors';

export const selectCartState =
    createFeatureSelector<CartState>('cart');


// Cart items
export const selectCartItems =
    createSelector(
        selectCartState,
        state => state.items
    );


// Cart ID
export const selectCartId =
    createSelector(
        selectCartState,
        state => state.cartId
    );


// User ID
export const selectCartUserId =
    createSelector(
        selectCartState,
        state => state.userId
    );


// Loading
export const selectCartLoading =
    createSelector(
        selectCartState,
        state => state.loading
    );


// Error
export const selectCartError =
    createSelector(
        selectCartState,
        state => state.error
    );


// Total number of products
// Number of unique products in cart
export const selectCartCount =
    createSelector(
        selectCartItems,
        items => items.length
    );


// Total price
export const selectCartTotal =
    createSelector(
        selectCartItems,
        selectAllProducts,

        (items, products) =>
            items.reduce((total, item) => {

                const product = products.find(
                    p => p.id === item.productId
                );

                return total +
                    (product?.price ?? 0) * item.quantity;

            }, 0)
    );


// Products inside cart
export const selectCartProducts =
    createSelector(
        selectCartItems,
        selectAllProducts,

        (items, products) => {

            return items
                .map(item => {

                    const product = products.find(
                        p => p.id === item.productId
                    );

                    if (!product) {
                        return null;
                    }

                    return {
                        ...product,
                        quantity: item.quantity
                    };

                })
                .filter(product => product !== null);

        }
    );