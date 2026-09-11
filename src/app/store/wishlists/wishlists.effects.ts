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
    withLatestFrom
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

import { selectWishlistState } from './wishlists.selectors';
import { WishlistService } from '../../core/services/wishlist';

@Injectable()
export class WishlistEffects {

    private actions$ = inject(Actions);
    private store = inject(Store);
    private wishlistService = inject(WishlistService);


    // LOAD WISHLIST

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
                                        wishlistId: wishlist.id,
                                        userId: wishlist.userId,
                                        productIds: wishlist.productIds
                                    })
                                );
                            }

                            return this.wishlistService
                                .createWishlist(userId)
                                .pipe(

                                    map(wishlist =>
                                        loadWishlistSuccess({
                                            wishlistId: wishlist.id,
                                            userId: wishlist.userId,
                                            productIds: wishlist.productIds
                                        })
                                    )

                                );
                        }),

                        catchError(() => {

                            console.error(
                                'Failed to load wishlist.'
                            );

                            return of(
                                loadWishlistFailure({
                                    error: 'Failed to load wishlist'
                                })
                            );
                        })

                    )
            )
        )
    );


    // SAVE WISHLIST

    syncWishlist$ = createEffect(
        () =>
            this.actions$.pipe(

                ofType(
                    addToWishlist,
                    removeFromWishlist
                ),

                withLatestFrom(
                    this.store.select(selectWishlistState)
                ),

                concatMap(([action, state]) => {

                    if (!state.wishlistId) {

                        console.error(
                            'Wishlist ID not found.'
                        );

                        return of();
                    }

                    return this.wishlistService
                        .updateWishlist(
                            state.wishlistId,
                            state.productIds
                        )
                        .pipe(

                            catchError(() => {

                                console.error(
                                    'Failed to save wishlist.'
                                );

                                return of();
                            })

                        );
                })

            ),
        {
            dispatch: false
        }
    );
}