import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';

import {
    loadProducts,
    loadProductsFailure,
    loadProductsSuccess
} from './products.actions';

import { products } from '../../core/models/product.model';
import { ProductState } from './products.state';

export const productAdapter = createEntityAdapter<products>();

const initialState: ProductState = productAdapter.getInitialState({
    loading: true,
    error: null
});

export const productsReducer = createReducer(
    initialState,

    on(loadProducts, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(loadProductsSuccess, (state, { products }) =>
        productAdapter.setAll(products, {
            ...state,
            loading: false
        })
    ),

    on(loadProductsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);