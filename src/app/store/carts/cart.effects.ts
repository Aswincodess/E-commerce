import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
    catchError,
    concatMap,
    map,
    of,
    switchMap,
    withLatestFrom
} from 'rxjs';

import { carts } from '../../core/services/carts.service';

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

import { selectCartState } from './cart.selectors';

@Injectable()
export class CartEffects {

    private actions$ = inject(Actions);
    private cartService = inject(carts);
    private store = inject(Store);


    // =========================
    // LOAD CART
    // =========================

    loadCart$ = createEffect(() =>
        this.actions$.pipe(

            ofType(loadCart),

            switchMap(({ userId }) =>
                this.cartService.getCart(userId).pipe(

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

                        // Create cart if user doesn't have one
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
                                error: 'Failed to load cart'
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

            withLatestFrom(
                this.store.select(selectCartState)
            ),

            // IMPORTANT:
            // Do not cancel previous requests
            concatMap(([action, state]) => {

                const user = JSON.parse(
                    localStorage.getItem('user') || '{}'
                );

                const userId = user.id;

                console.log(
                    'CART ACTION:',
                    action.type
                );

                console.log(
                    'CART STATE:',
                    state
                );

                if (!userId) {

                    console.error(
                        'No logged-in user found'
                    );

                    return of();
                }


                // =========================
                // CREATE CART
                // =========================

                if (!state.cartId) {

                    return this.cartService
                        .createCart({
                            userId,
                            items: state.items
                        })
                        .pipe(

                            map(cart => {

                                console.log(
                                    'Cart created:',
                                    cart
                                );

                                return setCartId({
                                    cartId: cart.id
                                });

                            }),

                            catchError(error => {

                                console.error(
                                    'Cart creation failed:',
                                    error
                                );

                                return of();

                            })

                        );
                }


                // =========================
                // UPDATE CART
                // =========================

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
                                'Cart updated successfully:',
                                cart
                            );

                            return setCartId({
                                cartId: state.cartId!
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
    );

}