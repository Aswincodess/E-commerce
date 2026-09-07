import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';

import {
    loadProducts,
    loadProductsFailure,
    loadProductsSuccess
} from './products.actions';

import { products } from '../../core/models/product.model';

@Injectable()
export class ProductsEffects {

    private actions$ = inject(Actions);
    private http = inject(HttpClient);

    loadProduct$ = createEffect(() =>
        this.actions$.pipe(

            ofType(loadProducts),

            switchMap(() =>
                this.http.get<products[]>(
                    'http://localhost:3000/products'
                ).pipe(

                    map(products =>
                        loadProductsSuccess({
                            products
                        })
                    ),

                    catchError(error => {

                        console.log('STATUS:', error);

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