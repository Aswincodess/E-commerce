export interface Payment{
    id:number;
    orderId:number;
    amount:number;
    method: 'card' | 'upi'| 'cod';
    status: 'pending' | 'paid' | 'failed';
}
