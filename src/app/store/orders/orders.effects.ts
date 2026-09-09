import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Router
} from '@angular/router';

import {
    Actions,
    createEffect,
    ofType
} from '@ngrx/effects';

import {
    catchError,
    exhaustMap,
    map,
    of,
    switchMap
} from 'rxjs';

import {
    createOrder,
    createOrderSuccess,
    createOrderFailure,

    loadOrders,
    loadOrdersSuccess,
    loadOrdersFailure,

    cancelOrder,
    cancelOrderSuccess,
    cancelOrderFailure,

    orderCompleted
} from './orders.actions';

import { clearCart } from '../carts/cart.actions';

import { Order } from '../../core/models/order.model';


@Injectable()
export class OrderEffects {

    private actions$ = inject(Actions);

    private http = inject(HttpClient);

    private router = inject(Router);

    private apiUrl = 'http://localhost:3000/orders';


    // ==========================================
    // CREATE ORDER
    // ==========================================

    createOrder$ = createEffect(() =>
        this.actions$.pipe(

            ofType(createOrder),

            exhaustMap(({ order }) =>

                this.http.post<Order>(
                    this.apiUrl,
                    order
                ).pipe(

                    map((createdOrder) =>
                        createOrderSuccess({
                            order: createdOrder
                        })
                    ),

                    catchError(() =>
                        of(
                            createOrderFailure({
                                error: 'Failed to create order'
                            })
                        )
                    )

                )

            )

        )
    );


    // ==========================================
    // CLEAR CART AFTER ORDER
    // ==========================================

    clearCartAfterOrder$ = createEffect(() =>
        this.actions$.pipe(

            ofType(createOrderSuccess),

            map(() => clearCart())

        )
    );


    // ==========================================
    // ORDER COMPLETED
    // ==========================================

    orderCompleted$ = createEffect(() =>
        this.actions$.pipe(

            ofType(createOrderSuccess),

            map(() => orderCompleted())

        )
    );


    // ==========================================
    // NAVIGATE TO SUCCESS PAGE
    // ==========================================

    navigateToSuccess$ = createEffect(
        () =>
            this.actions$.pipe(

                ofType(orderCompleted),

                map(() => {

                    this.router.navigate([
                        '/order-success'
                    ]);

                })

            ),
        {
            dispatch: false
        }
    );


    // ==========================================
    // LOAD CURRENT USER ORDERS
    // ==========================================

    loadOrders$ = createEffect(() =>
        this.actions$.pipe(

            ofType(loadOrders),

            switchMap(({ userId }) =>

                this.http.get<Order[]>(
                    `${this.apiUrl}?userId=${userId}`
                ).pipe(

                    map((orders) =>
                        loadOrdersSuccess({
                            orders
                        })
                    ),

                    catchError(() =>
                        of(
                            loadOrdersFailure({
                                error: 'Failed to load orders'
                            })
                        )
                    )

                )

            )

        )
    );


    // ==========================================
    // CANCEL ORDER
    // ==========================================

    cancelOrder$ = createEffect(() =>
        this.actions$.pipe(

            ofType(cancelOrder),

            exhaustMap(({ orderId }) =>

                this.http.patch<Order>(
                    `${this.apiUrl}/${orderId}`,
                    {
                        status: 'cancelled'
                    }
                ).pipe(

                    map((updatedOrder) =>
                        cancelOrderSuccess({
                            order: updatedOrder
                        })
                    ),

                    catchError(() =>
                        of(
                            cancelOrderFailure({
                                error: 'Failed to cancel order'
                            })
                        )
                    )

                )

            )

        )
    );

}