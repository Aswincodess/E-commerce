import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrderCancelling
} from '../../store/orders/order.selector';

import {
  loadOrders,
  cancelOrder,
  cancelOrderSuccess,
  cancelOrderFailure
} from '../../store/orders/orders.actions';

import { Auth } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class Orders implements OnInit {

  private store = inject(Store);
  private auth = inject(Auth);
  private toastService = inject(ToastService);
  private actions$ = inject(Actions);

  orders$ = this.store.select(selectOrders);
  loading$ = this.store.select(selectOrdersLoading);
  error$ = this.store.select(selectOrdersError);
  cancelling$ = this.store.select(selectOrderCancelling);

  ngOnInit(): void {
    this.loadOrders();

    this.actions$
      .pipe(
        ofType(cancelOrderSuccess),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.toastService.success('Order cancelled successfully');
      });

    this.actions$
      .pipe(
        ofType(cancelOrderFailure),
        takeUntilDestroyed()
      )
      .subscribe(({ error }) => {
        this.toastService.error(error || 'Failed to cancel order');
      });
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