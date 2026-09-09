import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import {
    catchError,
    concatMap,
    map,
    of,
    switchMap,
    withLatestFrom
} from 'rxjs';

import {
    loadWishlist,
    loadWishlistSuccess,
    loadWishlistFailure,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} from './wishlists.actions';

import { selectWishlistState } from './wishlists.selectors';

interface Wishlist {
    id: string;
    userId: string;
    productIds: number[];
}

@Injectable()
export class WishlistEffects {

    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private store = inject(Store);

    private apiUrl =
        'http://localhost:3000/wishlists';


    // =========================
    // LOAD WISHLIST
    // =========================

    loadWishlist$ = createEffect(() =>
        this.actions$.pipe(

            ofType(loadWishlist),

            switchMap(({ userId }) =>

                this.http
                    .get<Wishlist[]>(
                        `${this.apiUrl}?userId=${userId}`
                    )

                    .pipe(

                        switchMap(wishlists => {

                            if (wishlists.length > 0) {

                                const wishlist = wishlists[0];

                                return of(
                                    loadWishlistSuccess({
                                        wishlistId: wishlist.id,
                                        userId: wishlist.userId,
                                        productIds: wishlist.productIds
                                    })
                                );
                            }


                            // Create wishlist
                            return this.http
                                .post<Wishlist>(
                                    this.apiUrl,
                                    {
                                        userId,
                                        productIds: []
                                    }
                                )

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

                        catchError(error => {

                            console.error(
                                'Wishlist load failed:',
                                error
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


    // =========================
    // SYNC WISHLIST
    // =========================

    syncWishlist$ = createEffect(
        () =>
            this.actions$.pipe(

                ofType(
                    addToWishlist,
                    removeFromWishlist,
                    clearWishlist
                ),

                withLatestFrom(
                    this.store.select(selectWishlistState)
                ),

                // IMPORTANT:
                // Queue requests instead of cancelling them
                concatMap(([action, state]) => {

                    console.log(
                        'WISHLIST ACTION:',
                        action.type
                    );

                    console.log(
                        'WISHLIST STATE:',
                        state
                    );


                    if (!state.wishlistId) {

                        console.error(
                            'No wishlist ID found'
                        );

                        return of();

                    }


                    console.log(
                        'Saving wishlist:',
                        state.productIds
                    );


                    return this.http
                        .patch(
                            `${this.apiUrl}/${state.wishlistId}`,
                            {
                                productIds: state.productIds
                            }
                        )

                        .pipe(

                            map(response => {

                                console.log(
                                    'Wishlist saved:',
                                    response
                                );

                                return response;

                            }),

                            catchError(error => {

                                console.error(
                                    'Wishlist sync failed:',
                                    error
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