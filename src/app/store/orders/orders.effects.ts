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
    switchMap
} from 'rxjs';

import { OrderService } from '../../core/services/order.service.ts';

import {
    loadOrders,
    loadOrdersSuccess,
    loadOrdersFailure,
    createOrder,
    createOrderSuccess,
    createOrderFailure
} from './orders.actions';


@Injectable()
export class OrderEffects {

    private actions$ = inject(Actions);
    private orderService = inject(OrderService);


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

                this.orderService
                    .createOrder(order)

                    .pipe(

                        map(createdOrder =>
                            createOrderSuccess({
                                order: createdOrder
                            })
                        ),

                        catchError(() => {

                            console.error(
                                'Order creation failed.'
                            );

                            return of(
                                createOrderFailure({
                                    error:
                                        'Failed to create order'
                                })
                            );
                        })

                    )
            )
        )
    );

}