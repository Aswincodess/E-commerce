import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { PaginationComponent } from '../../../shared/pagination/pagination';

@Component({
  selector: 'app-orders',
  standalone: true,

  imports: [
    RouterLink,
    DatePipe,
    PaginationComponent
  ],

  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

  private orderService = inject(OrderService);
  private actions$ = inject(Actions);

  orders = signal<Order[]>([]);

  loading = signal(false);

  error = signal('');

  updatingOrderId = signal<string | null>(null);


  // Payment filter
  paymentFilter = signal<
    'all' | 'COD' | 'UPI' | 'CARD'
  >('all');


  // Status filter
  statusFilter = signal<
    'all' | 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  >('all');


  // Apply payment + status filters
  filteredOrders = computed(() => {

    const payment = this.paymentFilter();
    const status = this.statusFilter();

    return this.orders().filter(order => {

      const orderPayment =
        String(order.paymentMethod)
          .trim()
          .toUpperCase();

      const orderStatus =
        String(order.status)
          .trim()
          .toLowerCase();

      const paymentMatch =
        payment === 'all' ||
        orderPayment === payment;

      const statusMatch =
        status === 'all' ||
        orderStatus === status;

      return paymentMatch && statusMatch;
    });
  });


  scrollToOrders(): void {

    document.getElementById('orders-table')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }


  ngOnInit(): void {
    this.loadOrders();
  }


  loadOrders(): void {

    this.loading.set(true);
    this.error.set('');

    this.orderService
      .getAllOrders()
      .subscribe({

        next: (orders) => {

          this.orders.set(orders);

          this.loading.set(false);
        },

        error: () => {

          this.error.set(
            'Failed to load orders.'
          );

          this.loading.set(false);
        }

      });
  }


  setPaymentFilter(value: string): void {

    if (value === 'COD') {

      this.paymentFilter.set('COD');

    }
    else if (value === 'UPI') {

      this.paymentFilter.set('UPI');

    }
    else if (value === 'CARD') {

      this.paymentFilter.set('CARD');

    }
    else {

      this.paymentFilter.set('all');

    }
  }


  setStatusFilter(value: string): void {

    if (value === 'pending') {

      this.statusFilter.set('pending');

    }
    else if (value === 'confirmed') {

      this.statusFilter.set('confirmed');

    }
    else if (value === 'delivered') {

      this.statusFilter.set('delivered');

    }
    else if (value === 'cancelled') {

      this.statusFilter.set('cancelled');

    }
    else {

      this.statusFilter.set('all');

    }
  }


  changeOrderStatus(
    orderId: string,
    newStatus: Order['status']
  ): void {

    const order = this.orders().find(
      order => order.id === orderId
    );

    if (!order) return;


    // Delivered and cancelled orders cannot be changed
    if (
      order.status === 'delivered' ||
      order.status === 'cancelled'
    ) {
      return;
    }


    // Validate status transition
    if (
      !this.isValidStatusChange(
        order.status,
        newStatus
      )
    ) {

      this.error.set(
        'This order status cannot be changed in that way.'
      );

      return;
    }


    // Confirm cancellation
    if (newStatus === 'cancelled') {

      const confirmed = window.confirm(
        'Are you sure you want to cancel this order?'
      );

      if (!confirmed) return;

      this.cancelOrder(orderId);

      return;
    }


    // Update status
    this.updatingOrderId.set(orderId);
    this.error.set('');


    this.orderService
      .updateOrder(orderId, {
        status: newStatus
      })
      .subscribe({

        next: (updatedOrder) => {

          this.orders.update(orders =>
            orders.map(order =>
              order.id === updatedOrder.id
                ? updatedOrder
                : order
            )
          );

          this.updatingOrderId.set(null);
        },

        error: () => {

          this.error.set(
            'Failed to update order status.'
          );

          this.updatingOrderId.set(null);
        }

      });
  }


  cancelOrder(orderId: string): void {

    this.updatingOrderId.set(orderId);
    this.error.set('');


    this.orderService
      .cancelOrder(orderId)
      .subscribe({

        next: (updatedOrder) => {

          this.orders.update(orders =>
            orders.map(order =>
              order.id === updatedOrder.id
                ? updatedOrder
                : order
            )
          );

          this.updatingOrderId.set(null);
        },

        error: () => {

          this.error.set(
            'Failed to cancel order.'
          );

          this.updatingOrderId.set(null);
        }

      });
  }


  private isValidStatusChange(
    currentStatus: Order['status'],
    newStatus: Order['status']
  ): boolean {

    if (currentStatus === 'pending') {

      return (
        newStatus === 'confirmed' ||
        newStatus === 'cancelled'
      );
    }


    if (currentStatus === 'confirmed') {

      return (
        newStatus === 'delivered' ||
        newStatus === 'cancelled'
      );
    }


    return false;
  }

}