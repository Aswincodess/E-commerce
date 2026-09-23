import { createAction, props } from '@ngrx/store';
import { Order } from '../../core/models/order.model';


// Create Order
export const createOrder = createAction(
    '[Order] Create Order',
    props<{ order: Order }>()
);


// Create Order Success
export const createOrderSuccess = createAction(
    '[Order] Create Order Success',
    props<{ order: Order }>()
);


// Create Order Failure
export const createOrderFailure = createAction(
    '[Order] Create Order Failure',
    props<{ error: string }>()
);


// Load Orders
export const loadOrders = createAction(
    '[Order] Load Orders',
    props<{ userId: string }>()
);


// Load Orders Success
export const loadOrdersSuccess = createAction(
    '[Order] Load Orders Success',
    props<{ orders: Order[] }>()
);


// Load Orders Failure
export const loadOrdersFailure = createAction(
    '[Order] Load Orders Failure',
    props<{ error: string }>()
);

export const orderCompleted = createAction(
    '[Order] Order Completed'
);

export const cancelOrder = createAction(
    '[Order] Cancel Order',
    props<{ orderId: string }>()
);


export const cancelOrderSuccess = createAction(
    '[Order] Cancel Order Success',
    props<{ order: Order }>()
);


export const cancelOrderFailure = createAction(
    '[Order] Cancel Order Failure',
    props<{ error: string }>()
);

export const reduceProductStock = createAction(
    '[Order] Reduce Product Stock',
    props<{ order: Order }>()
);

export const reduceProductStockSuccess = createAction(
    '[Order] Reduce Product Stock Success'
);

export const reduceProductStockFailure = createAction(
    '[Order] Reduce Product Stock Failure',
    props<{ error: string }>()
);