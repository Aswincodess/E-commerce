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


    on(
        loadCart,
        (state, { userId }) => ({

            ...state,

            userId,

            loading: true,

            error: null

        })
    ),


    on(
        loadCartSuccess,

        (
            state,
            {
                cartId,
                userId,
                items
            }
        ) => ({

            ...state,

            cartId,

            userId,

            items,

            loading: false,

            error: null

        })
    ),


    on(
        loadCartFailure,

        (state, { error }) => ({

            ...state,

            loading: false,

            error

        })
    ),


    on(
        setCartId,

        (state, { cartId }) => ({

            ...state,

            cartId

        })
    ),


    on(
        addToCart,

        (state, { product }) => {

            const existingItem =
                state.items.find(

                    item =>
                        String(item.productId) ===
                        String(product.id)

                );


            if (existingItem) {

                return {

                    ...state,

                    items: state.items.map(

                        item =>

                            String(item.productId) ===
                                String(product.id)

                                ? {

                                    ...item,

                                    quantity:
                                        item.quantity + 1

                                }

                                : item

                    )

                };

            }


            return {

                ...state,

                items: [

                    ...state.items,

                    {

                        productId: product.id,

                        quantity: 1

                    }

                ]

            };

        }
    ),


    on(
        removeFromCart,

        (state, { productId }) => ({

            ...state,

            items: state.items.filter(

                item =>
                    String(item.productId) !==
                    String(productId)

            )

        })
    ),


    on(
        increaseQuantity,

        (state, { productId }) => ({

            ...state,

            items: state.items.map(

                item =>

                    String(item.productId) ===
                        String(productId)

                        ? {

                            ...item,

                            quantity:
                                item.quantity + 1

                        }

                        : item

            )

        })
    ),


    on(
        decreaseQuantity,

        (state, { productId }) => ({

            ...state,

            items: state.items

                .map(

                    item =>

                        String(item.productId) ===
                            String(productId)

                            ? {

                                ...item,

                                quantity:
                                    item.quantity - 1

                            }

                            : item

                )

                .filter(

                    item =>
                        item.quantity > 0

                )

        })
    ),


    on(
        clearCart,

        state => ({

            ...state,

            items: []

        })
    )

);