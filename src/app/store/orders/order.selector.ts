import {
    createFeatureSelector,
    createSelector
} from '@ngrx/store';

import {
    OrderState
} from './orders.reducers';


export const selectOrderState =
    createFeatureSelector<OrderState>(
        'orders'
    );

//all orders
export const selectOrders =
    createSelector(
        selectOrderState,

        state => state.orders
    );

//loading
export const selectOrdersLoading =
    createSelector(
        selectOrderState,

        state => state.loading
    );


//error
export const selectOrdersError =
    createSelector(
        selectOrderState,

        state => state.error
    );

//cancelling
export const selectOrderCancelling =
    createSelector(
        selectOrderState,

        state => state.cancelling
    );

//order count
export const selectOrderCount =
    createSelector(
        selectOrders,

        orders => orders.length
    );
