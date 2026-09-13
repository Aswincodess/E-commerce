import { createReducer, on } from '@ngrx/store';

import { initialCartState } from './cart.state';

import {
    loadCart,
    loadCartSuccess,
    loadCartFailure,
    setCartId,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
} from './cart.actions';

export const cartReducer = createReducer(

    initialCartState,

    // Load cart,store userid, set loading=true,clear error
    on(loadCart, (state, { userId }) => ({
        ...state,
        userId,
        loading: true,
        error: null
    })),

    // Cart loaded from JSON Server
    on(
        loadCartSuccess,
        (state, { cartId, userId, items }) => ({
            ...state,
            cartId,
            userId,
            items,
            loading: false,
            error: null
        })
    ),

    // Cart loading failed, stop loading shop error message
    on(loadCartFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Save cart ID
    on(setCartId, (state, { cartId }) => ({
        ...state,
        cartId
    })),

    // Add product
    on(addToCart, (state, { product }) => {

        const existingItem = state.items.find(
            item => item.productId === product.id  //Is this product already in the cart?
        );

        if (existingItem) {//if exist we will increase the product quantity by one
            return {
                ...state,

                items: state.items.map(item =>
                    item.productId === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                )
            };
        }

        return {  // doesnt exist then It adds a new CartItem.
            ...state,

            items: [
                ...state.items,
                {
                    productId: product.id,
                    quantity: 1
                }
            ]
        };
    }),

    // Remove product
    on(removeFromCart, (state, { productId }) => ({
        ...state,

        items: state.items.filter(
            item => item.productId !== productId
        )
    })),

    // Increase quantity
    on(increaseQuantity, (state, { productId }) => ({
        ...state,

        items: state.items.map(item =>
            item.productId === productId
                ? {
                    ...item,
                    quantity: item.quantity + 1
                }
                : item
        )
    })),

    // Decrease quantity
    on(decreaseQuantity, (state, { productId }) => ({
        ...state,

        items: state.items
            .map(item =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity: item.quantity - 1
                    }
                    : item
            )
            .filter(item => item.quantity > 0)
    })),

    // Clear cart (e.g. on logout)
    on(clearCart, (state) => ({
        ...state,
        items: []
    })),

);