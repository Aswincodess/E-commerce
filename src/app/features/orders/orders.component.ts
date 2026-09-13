import {Component,inject,OnInit} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import { RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrderCancelling
} from '../../store/orders/order.selector';
import {loadOrders,  cancelOrder} from '../../store/orders/orders.actions';
import {Auth} from '../../core/services/auth.service';

@Component({
  selector: 'app-orders',

  standalone: true,

  imports: [
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})


export class Orders implements OnInit {

  private store = inject(Store);

  private auth = inject(Auth);

  orders$ = this.store.select(
    selectOrders
  );

  loading$ = this.store.select(
    selectOrdersLoading
  );

  error$ = this.store.select(
    selectOrdersError
  );

  cancelling$ = this.store.select(
    selectOrderCancelling
  );

  ngOnInit(): void {

    
this.loadOrders();


  }

  loadOrders(): void {

    
    const user = this.auth.currentUser();

    if (!user || !user.id) {
      return;
    }

    this.store.dispatch(
      loadOrders({
        userId: user.id
      })
    );


  }

  cancelOrder(orderId: string): void {

   
const confirmed = window.confirm(
  'Are you sure you want to cancel this order?'
);

if (!confirmed) {
  return;
}

this.store.dispatch(
  cancelOrder({
    orderId
  })
);


  }

}
