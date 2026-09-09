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


// ==========================================
// ALL ORDERS
// ==========================================

export const selectOrders =
    createSelector(
        selectOrderState,

        state => state.orders
    );


// ==========================================
// LOADING
// ==========================================

export const selectOrdersLoading =
    createSelector(
        selectOrderState,

        state => state.loading
    );


// ==========================================
// ERROR
// ==========================================

export const selectOrdersError =
    createSelector(
        selectOrderState,

        state => state.error
    );


// ==========================================
// CANCELLING
// ==========================================

export const selectOrderCancelling =
    createSelector(
        selectOrderState,

        state => state.cancelling
    );


// ==========================================
// ORDER COUNT
// ==========================================

export const selectOrderCount =
    createSelector(
        selectOrders,

        orders => orders.length
    );
