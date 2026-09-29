import { Injectable, inject } from '@angular/core';

import {
    Actions,
    createEffect,
    ofType
} from '@ngrx/effects';

import { Store } from '@ngrx/store';

import {
    catchError,
    concatMap,
    map,
    of,
    switchMap,
    take
} from 'rxjs';

import { carts } from '../../core/services/cart/carts.service';

import { Auth } from '../../core/services/auth/auth.service';

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

import {
    selectCartState
} from './cart.selectors';


@Injectable()
export class CartEffects {

    private actions$ = inject(Actions);

    private cartService = inject(carts);

    private store = inject(Store);

    private auth = inject(Auth);


    // =========================
    // LOAD CART
    // =========================

    loadCart$ = createEffect(() =>

        this.actions$.pipe(

            ofType(loadCart),

            switchMap(({ userId }) =>

                this.cartService
                    .getCart(userId)

                    .pipe(

                        switchMap(carts => {

                            if (carts.length > 0) {

                                const cart = carts[0];

                                return of(

                                    loadCartSuccess({

                                        cartId: cart.id,

                                        userId: cart.userId,

                                        items: cart.items

                                    })

                                );

                            }


                            return this.cartService

                                .createCart({

                                    userId,

                                    items: []

                                })

                                .pipe(

                                    map(cart =>

                                        loadCartSuccess({

                                            cartId: cart.id,

                                            userId: cart.userId,

                                            items: cart.items

                                        })

                                    )

                                );

                        }),


                        catchError(error => {

                            console.error(
                                'Cart load failed:',
                                error
                            );

                            return of(

                                loadCartFailure({

                                    error:
                                        'Failed to load cart'

                                })

                            );

                        })

                    )

            )

        )

    );


    // =========================
    // SYNC CART
    // =========================

    syncCart$ = createEffect(() =>

        this.actions$.pipe(

            ofType(

                addToCart,

                removeFromCart,

                increaseQuantity,

                decreaseQuantity,

                clearCart

            ),


            concatMap(() =>

                this.store
                    .select(selectCartState)

                    .pipe(

                        take(1),

                        switchMap(state => {

                            const user =
                                this.auth.currentUser();


                            const userId =
                                user?.id;


                            if (!userId) {

                                console.error(
                                    'No logged-in user'
                                );

                                return of();

                            }


                            if (!state.cartId) {

                                console.error(
                                    'Cart ID is missing'
                                );

                                return of();

                            }


                            console.log(
                                'Updating cart:',
                                state.cartId
                            );


                            console.log(
                                'Items being saved:',
                                state.items
                            );


                            return this.cartService

                                .updateCart(

                                    state.cartId,

                                    state.items

                                )

                                .pipe(

                                    map(cart => {

                                        console.log(
                                            'Cart successfully saved:',
                                            cart
                                        );


                                        return setCartId({

                                            cartId:
                                                cart.id

                                        });

                                    }),


                                    catchError(error => {

                                        console.error(
                                            'Cart update failed:',
                                            error
                                        );


                                        return of();

                                    })

                                );

                        })

                    )

            )

        )

    );

}