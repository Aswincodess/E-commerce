import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { DashboardService } from '../../../core/services/dashboard';
import { User } from '../../../core/models/user.model';
import { products } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';
import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe,BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  products: products[] = [];
  orders: Order[] = [];

  loading = true;
  error = '';

  totalUsers = 0;
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading = true;
    this.error = '';

    this.dashboardService.getDashboardData().subscribe({

      next: (data) => {

        console.log('DASHBOARD DATA:', data);

        this.users = data.users;
        this.products = data.products;
        this.orders = data.orders;

        this.totalUsers = this.users.length;

        this.totalProducts =
          this.products.filter(product => !product.isDeleted).length;

        this.totalOrders = this.orders.length;

        this.totalRevenue =
          this.orders
            .filter(order => order.status !== 'cancelled')
            .reduce(
              (total, order) => total + order.total,
              0
            );

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('DASHBOARD ERROR:', error);

        this.error = 'Failed to load dashboard data';

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }

  revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Revenue',
        data: [],
        tension: 0.3
      }
    ]
  };

  revenueChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };
}