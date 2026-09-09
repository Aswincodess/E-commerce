import { createFeatureSelector,createSelector } from "@ngrx/store";
import { ProductState } from "./products.state";
import { productAdapter } from "./products.reducer";

export const selectProductState = createFeatureSelector<ProductState>('products')

export const {
    selectAll: selectAllProducts,
    selectEntities: selectProductEntities,
    selectIds: selectProductIds,
    selectTotal: selectProductTotal
} = productAdapter.getSelectors(selectProductState);

export const selectProductsLoading = createSelector(
    selectProductState,
    (state) => state.loading
);

export const selectProductsError = createSelector(
    selectProductState,
    (state) => state.error
);

export const selectProductById = (id: string | number) =>
    createSelector(
        selectProductEntities,
        (entities) => entities[id]
    );
export const selectFeaturedProducts = createSelector(
    selectAllProducts,
    products =>
        [...products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 8)
);