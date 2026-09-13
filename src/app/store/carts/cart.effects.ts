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
    withLatestFrom
} from 'rxjs';

import { carts } from '../../core/services/carts.service';
import { Auth } from '../../core/services/auth.service';

import {
    loadCart,
    loadCartSuccess,
    loadCartFailure,
    setCartId,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
} from './cart.actions';

import { selectCartState } from './cart.selectors';


@Injectable()
export class CartEffects {

    private actions$ = inject(Actions);

    private cartService = inject(carts);

    private store = inject(Store);

    private auth = inject(Auth);


    ///here we are loading the cart,Gets the user's cart from JSON Server.

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

                        catchError(() => {

                            console.error(
                                'Cart load failed.'
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


    ///sync cart , istens for four cart-changing actions.

    syncCart$ = createEffect(() =>

        this.actions$.pipe(

            ofType(
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity
            ),

            withLatestFrom(
                this.store.select(selectCartState)
            ),

            concatMap(([action, state]) => {

                const user =
                    this.auth.currentUser();

                const userId =
                    user?.id;


                if (!userId) {

                    console.error(
                        'No logged-in user found'
                    );

                    return of();

                }

              //creating cart

                if (!state.cartId) {

                    return this.cartService
                        .createCart({

                            userId,

                            items: state.items

                        })

                        .pipe(

                            map(cart =>

                                setCartId({
                                    cartId: cart.id
                                })

                            ),

                            catchError(() => {

                                console.error(
                                    'Cart creation failed.'
                                );

                                return of();

                            })

                        );

                }


                //if cart id already exist update the cart

                return this.cartService
                    .updateCart(
                        state.cartId,
                        state.items
                    )

                    .pipe(

                        map(cart =>

                            setCartId({
                                cartId: state.cartId!
                            })

                        ),

                        catchError(() => {

                            console.error(
                                'Cart update failed.'
                            );

                            return of();

                        })

                    );

            })

        )

    );

}