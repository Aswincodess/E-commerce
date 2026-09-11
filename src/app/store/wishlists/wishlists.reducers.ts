import { createReducer, on } from '@ngrx/store';

import {
    loadWishlist,
    loadWishlistSuccess,
    loadWishlistFailure,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} from './wishlists.actions';

import { initialWishlistState } from './wishlists.state';

export const wishlistReducer = createReducer(

    initialWishlistState,

    // Load wishlist
    on(loadWishlist, (state, { userId }) => ({
        ...state,
        userId,
        loading: true,
        error: null
    })),

    // Wishlist loaded successfully
    on(
        loadWishlistSuccess,
        (state, { wishlistId, userId, productIds }) => ({
            ...state,
            wishlistId,
            userId,
            productIds,
            loading: false,
            error: null
        })
    ),

    // Wishlist loading failed
    on(loadWishlistFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Add product
    on(addToWishlist, (state, { productId }) => {

        // Don't add the same product twice
        if (state.productIds.includes(productId)) {
            return state;
        }

        return {
            ...state,
            productIds: [
                ...state.productIds,
                productId
            ]
        };
    }),

    // Remove product
    on(removeFromWishlist, (state, { productId }) => ({
        ...state,
        productIds: state.productIds.filter(
            id => id !== productId
        )
    })),

    // Clear wishlist (e.g. on logout)
    on(clearWishlist, (state) => ({
        ...state,
        productIds: []
    })),
    

);