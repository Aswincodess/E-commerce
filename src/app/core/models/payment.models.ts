export interface Payment {

    id: number;

    orderId: number;

    amount: number;

    method: 'COD' | 'UPI' | 'CARD';

    status: 'pending' | 'paid' | 'failed';

}