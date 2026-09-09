import { createFeatureSelector, createSelector } from '@ngrx/store';

import { WishlistState } from './wishlists.state';
import { selectAllProducts } from '../products/products.selectors';


// Get wishlist state
export const selectWishlistState =
    createFeatureSelector<WishlistState>('wishlist');


// Get product IDs in wishlist
export const selectWishlistProductIds =
    createSelector(
        selectWishlistState,
        state => state.productIds
    );


// Get wishlist ID
export const selectWishlistId =
    createSelector(
        selectWishlistState,
        state => state.wishlistId
    );


// Get user ID
export const selectWishlistUserId =
    createSelector(
        selectWishlistState,
        state => state.userId
    );


// Get loading state
export const selectWishlistLoading =
    createSelector(
        selectWishlistState,
        state => state.loading
    );


// Get error
export const selectWishlistError =
    createSelector(
        selectWishlistState,
        state => state.error
    );


// Get wishlist count
export const selectWishlistCount =
    createSelector(
        selectWishlistProductIds,
        productIds => productIds.length
    );


// Get actual products in wishlist
export const selectWishlistProducts =
    createSelector(
        selectWishlistProductIds,
        selectAllProducts,
        (productIds, products) => {

            return products.filter(product =>
                productIds.includes(product.id)
            );

        }
    );


// Check whether a product is in wishlist
export const selectIsInWishlist = (productId: number) =>
    createSelector(
        selectWishlistProductIds,
        productIds => productIds.includes(productId)
    );