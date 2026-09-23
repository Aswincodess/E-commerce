import { Injectable, inject } from '@angular/core';

import {
    Actions,
    createEffect,
    ofType
} from '@ngrx/effects';

import {
    catchError,
    map,
    of,
    switchMap,
    forkJoin
} from 'rxjs';

import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';

import {
    loadOrders,
    loadOrdersSuccess,
    loadOrdersFailure,

    createOrder,
    createOrderSuccess,
    createOrderFailure,

    cancelOrder,
    cancelOrderSuccess,
    cancelOrderFailure
} from './orders.actions';
import { loadProducts } from '../products/products.actions';


@Injectable()
export class OrderEffects {

    private actions$ = inject(Actions);

    private orderService =
        inject(OrderService);

    private productService =
        inject(ProductService);


    // LOAD ORDERS

    loadOrders$ = createEffect(() =>
        this.actions$.pipe(

            ofType(loadOrders),

            switchMap(({ userId }) =>

                this.orderService
                    .getOrdersByUser(userId)

                    .pipe(

                        map(orders =>
                            loadOrdersSuccess({
                                orders
                            })
                        ),

                        catchError(() => {

                            console.error(
                                'Orders load failed.'
                            );

                            return of(
                                loadOrdersFailure({
                                    error:
                                        'Failed to load orders'
                                })
                            );

                        })

                    )

            )

        )
    );


    // CREATE ORDER

    createOrder$ = createEffect(() =>
        this.actions$.pipe(

            ofType(createOrder),

            switchMap(({ order }) =>

                // Get latest product stock
                this.productService
                    .getProducts()

                    .pipe(

                        switchMap(currentProducts => {

                            // Check stock before creating order
                            for (const item of order.items) {

                                const product =
                                    currentProducts.find(
                                        product =>
                                            String(product.id) ===
                                            String(item.productId)
                                    );

                                if (!product) {

                                    return of(
                                        createOrderFailure({
                                            error:
                                                `Product "${item.name}" is no longer available.`
                                        })
                                    );

                                }

                                if (
                                    item.quantity >
                                    product.stock
                                ) {

                                    return of(
                                        createOrderFailure({
                                            error:
                                                `"${product.name}" has only ${product.stock} unit(s) available.`
                                        })
                                    );

                                }

                            }


                            // Stock is available
                            // Create the order first

                            return this.orderService
                                .createOrder(order)

                                .pipe(

                                    // After order is created,
                                    // reduce the stock

                                    switchMap(createdOrder => {

                                        const updates =
                                            createdOrder.items.map(item =>

                                                this.productService
                                                    .getProductById(
                                                        String(item.productId)
                                                    )

                                                    .pipe(

                                                        switchMap(product => {

                                                            // Check stock again
                                                            // before updating

                                                            if (
                                                                product.stock <
                                                                item.quantity
                                                            ) {

                                                                throw new Error(
                                                                    `"${product.name}" does not have enough stock.`
                                                                );

                                                            }

                                                            const updatedProduct = {
                                                                ...product,

                                                                stock:
                                                                    product.stock -
                                                                    item.quantity
                                                            };

                                                            return this.productService
                                                                .updateProduct(
                                                                    String(product.id),
                                                                    updatedProduct
                                                                );

                                                        })

                                                    )

                                            );


                                        return forkJoin(updates)

                                            .pipe(

                                                // ONLY NOW order succeeds

                                                map(() =>
                                                    createOrderSuccess({
                                                        order:
                                                            createdOrder
                                                    })
                                                )

                                            );

                                    })

                                );

                        }),

                        catchError((error) => {

                            console.error(
                                'Order creation or stock update failed.',
                                error
                            );

                            return of(
                                createOrderFailure({
                                    error:
                                        error?.message ||
                                        'Failed to place order'
                                })
                            );

                        })

                    )

            )

        )
    );

    // REFRESH PRODUCTS AFTER ORDER
    // This gets the latest stock from JSON Server

    refreshProductsAfterOrder$ = createEffect(() =>
        this.actions$.pipe(

            ofType(createOrderSuccess),

            map(() =>
                loadProducts()
            )

        )
    );


    // CANCEL ORDER

    cancelOrder$ = createEffect(() =>
        this.actions$.pipe(

            ofType(cancelOrder),

            switchMap(({ orderId }) =>

                this.orderService
                    .cancelOrder(orderId)

                    .pipe(

                        map(order =>
                            cancelOrderSuccess({
                                order
                            })
                        ),

                        catchError(() => {

                            console.error(
                                'Order cancellation failed.'
                            );

                            return of(
                                cancelOrderFailure({
                                    error:
                                        'Failed to cancel order'
                                })
                            );

                        })

                    )

            )

        )
    );

}