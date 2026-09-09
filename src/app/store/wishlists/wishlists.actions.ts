import { createAction, props } from '@ngrx/store';


// Load wishlist
export const loadWishlist = createAction(
    '[Wishlist] Load Wishlist',
    props<{ userId: string }>()
);


// Load wishlist success
export const loadWishlistSuccess = createAction(
    '[Wishlist] Load Wishlist Success',
    props<{
        wishlistId: string;
        userId: string;
        productIds: number[];
    }>()
);


// Load wishlist failure
export const loadWishlistFailure = createAction(
    '[Wishlist] Load Wishlist Failure',
    props<{ error: string }>()
);


// Add product to wishlist
export const addToWishlist = createAction(
    '[Wishlist] Add To Wishlist',
    props<{ productId: number }>()
);


// Remove product from wishlist
export const removeFromWishlist = createAction(
    '[Wishlist] Remove From Wishlist',
    props<{ productId: number }>()
);


// Clear wishlist
export const clearWishlist = createAction(
    '[Wishlist] Clear Wishlist'
);