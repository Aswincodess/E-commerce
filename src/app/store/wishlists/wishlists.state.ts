export interface WishlistState {
    wishlistId: string | null;
    userId: string | null;
    productIds: number[];
    loading: boolean;
    error: string | null;
}

export const initialWishlistState: WishlistState = {
    wishlistId: null,
    userId: null,
    productIds: [],
    loading: false,
    error: null
};