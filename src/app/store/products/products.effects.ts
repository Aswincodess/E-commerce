import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import {
    loadProducts,
    loadProductsFailure,
    loadProductsSuccess
} from './products.actions';

import { ProductService } from '../../core/services/product/product.service';

@Injectable()
export class ProductsEffects {

    private actions$ = inject(Actions);
    private productService = inject(ProductService);

    loadProduct$ = createEffect(() =>
        this.actions$.pipe(

            ofType(loadProducts),

            switchMap(() =>
                this.productService.getProducts().pipe(

                    map(products =>
                        loadProductsSuccess({
                            products
                        })
                    ),

                    catchError(() => {

                        console.error(
                            'Failed to load products.'
                        );

                        return of(
                            loadProductsFailure({
                                error: 'Failed to load products'
                            })
                        );

                    })

                )
            )
        )
    );
}