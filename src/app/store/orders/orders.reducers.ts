import {
    createReducer,
    on
} from '@ngrx/store';

import {
    createOrderSuccess,

    loadOrders,
    loadOrdersSuccess,
    loadOrdersFailure,

    cancelOrder,
    cancelOrderSuccess,
    cancelOrderFailure
} from './orders.actions';

import { Order } from '../../core/models/order.model';


export interface OrderState {

    orders: Order[];

    loading: boolean;

    error: string | null;

    cancelling: boolean;

}


export const initialState: OrderState = {

    orders: [],

    loading: false,

    error: null,

    cancelling: false

};


export const orderReducer = createReducer(

    initialState,

    //creating an order
    on(
        createOrderSuccess,

        (state, { order }) => ({

            ...state,

            orders: [
                order,
                ...state.orders
            ]

        })

    ),

   //load order
    on(
        loadOrders,

        (state) => ({

            ...state,

            loading: true,

            error: null

        })

    ),


       //load order success
    on(
        loadOrdersSuccess,

        (state, { orders }) => ({

            ...state,

            orders,

            loading: false,

            error: null

        })

    ),

    // load failure
    on(
        loadOrdersFailure,

        (state, { error }) => ({

            ...state,

            loading: false,

            error

        })

    ),

      //cancel order
     on(
        cancelOrder,

        (state) => ({

            ...state,

            cancelling: true,

            error: null

        })

    ),

   //cancel order success
    on(
        cancelOrderSuccess,

        (state, { order }) => ({

            ...state,

            orders: state.orders.map(
                existingOrder =>
                    existingOrder.id === order.id
                        ? order
                        : existingOrder
            ),

            cancelling: false,

            error: null

        })

    ),


    //cancel order failure
    on(
        cancelOrderFailure,

        (state, { error }) => ({

            ...state,

            cancelling: false,

            error

        })

    )

);