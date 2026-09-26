import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { DatePipe } from '@angular/common';

import { OrderService } from '../../../core/services/order/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetail {

  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  order = signal<Order | null>(null);

  loading = signal(false);

  error = signal('');

  ngOnInit(): void {

    const orderId =
      this.route.snapshot.paramMap.get('id');

    if (!orderId) {
      this.error.set('Order ID not found.');
      return;
    }

    this.loadOrder(orderId);
  }

  loadOrder(orderId: string): void {

    this.loading.set(true);

    this.error.set('');

    this.orderService
      .getOrderById(orderId)
      .subscribe({

        next: (order) => {

          this.order.set(order);

          this.loading.set(false);
        },

        error: () => {

          this.error.set(
            'Failed to load order.'
          );

          this.loading.set(false);
        }

      });
  }
}