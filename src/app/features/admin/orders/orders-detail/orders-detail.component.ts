import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';
import { OrderService } from '../../../../core/services/order.service.ts';
import { Order } from '../../../../core/models/order.model';


@Component({
  selector: 'app-order-details',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './orders-detail.component.html',

  styleUrl: './orders-detail.component.css'
})
export class OrderDetailsComponent {


  private orderService = inject(OrderService);

  private route = inject(ActivatedRoute);


  // Selected order

  order = signal<Order | null>(null);


  // Loading

  loading = signal(false);


  // Error

  error = signal('');


  // Order ID

  orderId = '';


  ngOnInit(): void {

    this.orderId =
      this.route.snapshot.paramMap.get('id') ?? '';


    if (!this.orderId) {

      this.error.set(
        'Order ID not found.'
      );

      return;

    }


    this.loadOrder();

  }


  // Load selected order

  loadOrder(): void {

    this.loading.set(true);

    this.error.set('');


    this.orderService
      .getOrderById(this.orderId)
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