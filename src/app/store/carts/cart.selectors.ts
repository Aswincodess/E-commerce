import {
    createFeatureSelector,
    createSelector
} from '@ngrx/store';

import { CartState } from './cart.state';

import {
    selectAllProducts
} from '../products/products.selectors';


export const selectCartState =
    createFeatureSelector<CartState>('cart');


export const selectCartItems =
    createSelector(

        selectCartState,

        state => state.items

    );


export const selectCartId =
    createSelector(

        selectCartState,

        state => state.cartId

    );


export const selectCartUserId =
    createSelector(

        selectCartState,

        state => state.userId

    );


export const selectCartLoading =
    createSelector(

        selectCartState,

        state => state.loading

    );


export const selectCartError =
    createSelector(

        selectCartState,

        state => state.error

    );


export const selectCartCount =
    createSelector(

        selectCartItems,

        items => items.length

    );


export const selectCartTotal =
    createSelector(

        selectCartItems,

        selectAllProducts,

        (items, products) =>

            items.reduce(

                (total, item) => {

                    const product =
                        products.find(

                            p =>
                                String(p.id) ===
                                String(item.productId)

                        );


                    return total +

                        (product?.price ?? 0) *
                        item.quantity;

                },

                0

            )

    );


export const selectCartProducts =
    createSelector(

        selectCartItems,

        selectAllProducts,

        (items, products) => {

            return items

                .map(item => {

                    const product =
                        products.find(

                            p =>
                                String(p.id) ===
                                String(item.productId)

                        );


                    if (!product) {

                        return null;

                    }


                    return {

                        ...product,

                        quantity:
                            item.quantity

                    };

                })

                .filter(

                    product =>
                        product !== null

                );

        }

    );