import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
    catchError,
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


    // ================================
    // LOAD CART
    // ================================

    loadCart$ = createEffect(() =>
        this.actions$.pipe(

            ofType(loadCart),

            switchMap(({ userId }) =>
                this.cartService.getCart(userId).pipe(

                    map(carts => {

                        if (carts.length === 0) {
                            return loadCartSuccess({
                                cartId: 0,
                                userId,
                                items: []
                            });
                        }

                        const cart = carts[0];

                        return loadCartSuccess({
                            cartId: cart.id,
                            userId: cart.userId,
                            items: cart.items
                        });
                    }),

                    catchError(() =>
                        of(
                            loadCartFailure({
                                error: 'Failed to load cart'
                            })
                        )
                    )
                )
            )
        )
    );


    // ================================
    // SYNC CART
    // ================================

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

            switchMap(([action, state]) => {

                const user = JSON.parse(
                    localStorage.getItem('user') || '{}'
                );

                const userId = user.id;


                // ================================
                // CREATE NEW CART
                // ================================

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

                            catchError(() =>
                                of()
                            )
                        );
                }


                // ================================
                // UPDATE EXISTING CART
                // ================================

                return this.cartService
                    .updateCart(
                        state.cartId,
                        state.items
                    )
                    .pipe(

                        map(() =>
                            setCartId({
                                cartId: state.cartId!
                            })
                        ),

                        catchError(() =>
                            of()
                        )
                    );
            })
        )
    );

}