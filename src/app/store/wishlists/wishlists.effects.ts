import { Injectable, inject } from '@angular/core';

import {
    Actions,
    createEffect,
    ofType
} from '@ngrx/effects';

import {
    catchError,
    concatMap,
    map,
    of,
    switchMap,
    take
} from 'rxjs';

import { Store } from '@ngrx/store';

import {
    loadWishlist,
    loadWishlistSuccess,
    loadWishlistFailure,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} from './wishlists.actions';

import {
    selectWishlistState
} from './wishlists.selectors';

import {
    WishlistService
} from '../../core/services/wishlist/wishlist';


@Injectable()
export class WishlistEffects {

    private actions$ =
        inject(Actions);

    private store =
        inject(Store);

    private wishlistService =
        inject(WishlistService);


    // =========================
    // LOAD WISHLIST
    // =========================

    loadWishlist$ = createEffect(() =>

        this.actions$.pipe(

            ofType(loadWishlist),

            switchMap(({ userId }) =>

                this.wishlistService
                    .getWishlist(userId)

                    .pipe(

                        switchMap(wishlists => {

                            if (wishlists.length > 0) {

                                const wishlist =
                                    wishlists[0];


                                return of(

                                    loadWishlistSuccess({

                                        wishlistId:
                                            wishlist.id,

                                        userId:
                                            wishlist.userId,

                                        productIds:
                                            wishlist.productIds

                                    })

                                );

                            }


                            return this.wishlistService

                                .createWishlist(userId)

                                .pipe(

                                    map(wishlist =>

                                        loadWishlistSuccess({

                                            wishlistId:
                                                wishlist.id,

                                            userId:
                                                wishlist.userId,

                                            productIds:
                                                wishlist.productIds

                                        })

                                    )

                                );

                        }),


                        catchError(error => {

                            console.error(
                                'Failed to load wishlist:',
                                error
                            );


                            return of(

                                loadWishlistFailure({

                                    error:
                                        'Failed to load wishlist'

                                })

                            );

                        })

                    )

            )

        )

    );


    // =========================
    // SYNC WISHLIST
    // =========================

    syncWishlist$ = createEffect(() =>

        this.actions$.pipe(

            ofType(

                addToWishlist,

                removeFromWishlist,

                clearWishlist

            ),


            concatMap(() =>

                this.store
                    .select(selectWishlistState)

                    .pipe(

                        take(1),

                        switchMap(state => {

                            if (!state.wishlistId) {

                                console.error(
                                    'Wishlist ID not found.'
                                );

                                return of();

                            }


                            console.log(
                                'Updating wishlist:',
                                state.wishlistId
                            );


                            console.log(
                                'Products being saved:',
                                state.productIds
                            );


                            return this.wishlistService

                                .updateWishlist(

                                    state.wishlistId,

                                    state.productIds

                                )

                                .pipe(

                                    map(wishlist => {

                                        console.log(
                                            'Wishlist updated:',
                                            wishlist
                                        );

                                        return wishlist;

                                    }),

                                    catchError(error => {

                                        console.error(
                                            'Failed to save wishlist:',
                                            error
                                        );

                                        return of();

                                    })

                                );

                        })

                    )

            )

        ),

        {
            dispatch: false
        }

    );

}