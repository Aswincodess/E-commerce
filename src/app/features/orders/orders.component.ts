import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit
} from '@angular/core';

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

import { Auth } from '../../core/services/auth/auth.service';
import { ToastService } from '../../core/services/toast/toast';

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
  private destroyRef = inject(DestroyRef);

  orders$ = this.store.select(selectOrders);
  loading$ = this.store.select(selectOrdersLoading);
  error$ = this.store.select(selectOrdersError);
  cancelling$ = this.store.select(selectOrderCancelling);

  constructor() {

    effect(() => {

      const user = this.auth.currentUser();

      console.log('Orders - current user:', user);

      if (!user?.id) {
        return;
      }

      console.log(
        'Loading orders for:',
        user.id
      );

      this.store.dispatch(
        loadOrders({
          userId: user.id
        })
      );

    });

  }

  ngOnInit(): void {

    this.actions$
      .pipe(
        ofType(cancelOrderSuccess),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {

        this.toastService.success(
          'Order cancelled successfully'
        );

      });

    this.actions$
      .pipe(
        ofType(cancelOrderFailure),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ error }) => {

        this.toastService.error(
          error || 'Failed to cancel order'
        );

      });

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