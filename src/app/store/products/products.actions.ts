import { createAction,props } from "@ngrx/store";
import { products } from "../../core/models/product.model";
export const loadProducts = createAction(
    `[Products] Load products`
);

export const loadProductsSuccess = createAction(
    `[Products] Load Products Success`,
    props<{ products: products[] }>()
)

export const loadProductsFailure = createAction(
    `[Products] Load Products Failure`,
    props<{ error:string }>()
)