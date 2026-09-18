import { Component, inject, signal } from '@angular/core';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service.ts';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {

  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);

  loading = signal(false);

  error = signal('');

  updatingOrderId = signal<string | null>(null);


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


  changeOrderStatus(
    orderId: string,
    status: Order['status']
  ): void {

    this.updatingOrderId.set(orderId);

    this.error.set('');


    this.orderService
      .updateOrder(
        orderId,
        {
          status: status
        }
      )
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

}