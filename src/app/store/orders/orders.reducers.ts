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


    // ==========================================
    // CREATE ORDER SUCCESS
    // ==========================================

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


    // ==========================================
    // LOAD ORDERS
    // ==========================================

    on(
        loadOrders,

        (state) => ({

            ...state,

            loading: true,

            error: null

        })

    ),


    // ==========================================
    // LOAD ORDERS SUCCESS
    // ==========================================

    on(
        loadOrdersSuccess,

        (state, { orders }) => ({

            ...state,

            orders,

            loading: false,

            error: null

        })

    ),


    // ==========================================
    // LOAD ORDERS FAILURE
    // ==========================================

    on(
        loadOrdersFailure,

        (state, { error }) => ({

            ...state,

            loading: false,

            error

        })

    ),


    // ==========================================
    // CANCEL ORDER
    // ==========================================

    on(
        cancelOrder,

        (state) => ({

            ...state,

            cancelling: true,

            error: null

        })

    ),


    // ==========================================
    // CANCEL ORDER SUCCESS
    // ==========================================

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


    // ==========================================
    // CANCEL ORDER FAILURE
    // ==========================================

    on(
        cancelOrderFailure,

        (state, { error }) => ({

            ...state,

            cancelling: false,

            error

        })

    )

);