import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import {
  DecimalPipe,
  DatePipe
} from '@angular/common';

import { DashboardService } from '../../../core/services/dashboard';

import { User } from '../../../core/models/user.model';
import { products } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';

import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    BaseChartDirective,
    DatePipe,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);


  // ==============================
  // DATA
  // ==============================

  users: User[] = [];

  products: products[] = [];

  orders: Order[] = [];


  // ==============================
  // STATE
  // ==============================

  loading = true;

  error = '';


  // ==============================
  // SUMMARY VALUES
  // ==============================

  totalUsers = 0;

  totalProducts = 0;

  totalOrders = 0;

  totalRevenue = 0;


  // ==============================
  // REVENUE PERIOD
  // ==============================

  revenuePeriod: 'day' | 'week' | 'month' = 'day';


  // ==============================
  // REVENUE CHART
  // ==============================

  revenueChartData: ChartConfiguration<'line'>['data'] = {

    labels: [],

    datasets: [
      {
        label: 'Revenue',

        data: [],

        tension: 0.3,

        fill: true
      }
    ]

  };


  revenueChartOptions: ChartOptions<'line'> = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: 'index'
    },

    plugins: {

      legend: {
        display: false
      },

      tooltip: {

        callbacks: {

          label: (context) => {

            const value =
              Number(context.raw || 0);

            return ` Revenue: ₹${value.toLocaleString('en-IN')}`;

          }

        }

      }

    },

    scales: {

      x: {

        grid: {
          display: false
        }

      },

      y: {

        beginAtZero: true,

        ticks: {

          callback: (value) =>
            `₹${Number(value).toLocaleString('en-IN')}`

        }

      }

    }

  };


  // ==============================
  // ORDER STATUS CHART
  // ==============================

  orderStatusChartData: ChartConfiguration<'bar'>['data'] = {

    labels: [
      'Pending',
      'Confirmed',
      'Delivered',
      'Cancelled'
    ],

    datasets: [
      {
        label: 'Orders',

        data: [0, 0, 0, 0],

        backgroundColor: [
          '#D4552B',
          '#4F6D7A',
          '#3F7D58',
          '#B94A48'
        ],

        borderRadius: 6
      }
    ]

  };


  orderStatusChartOptions: ChartOptions<'bar'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      }

    },

    scales: {

      y: {

        beginAtZero: true,

        ticks: {
          precision: 0
        }

      }

    }

  };


  // ==============================
  // PRODUCT CATEGORY CHART
  // ==============================

  productCategoryChartData: ChartConfiguration<'doughnut'>['data'] = {

    labels: [],

    datasets: [
      {
        label: 'Products Sold',

        data: [],

        backgroundColor: [
          '#D4552B',
          '#4F6D7A',
          '#3F7D58',
          '#8A6D5A',
          '#7B61A8',
          '#C58B39',
          '#5B7C99',
          '#A65D5D'
        ],

        borderWidth: 2
      }
    ]

  };


  productCategoryChartOptions: ChartOptions<'doughnut'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: 'bottom'
      }

    }

  };


  // ==============================
  // RECENT ORDERS
  // ==============================

  recentOrders: Order[] = [];


  // ==============================
  // LOW STOCK PRODUCTS
  // ==============================

  lowStockProducts: products[] = [];


  // ==============================
  // TOP SELLING PRODUCTS
  // ==============================

  topSellingProducts: {
    product: products;
    quantity: number;
  }[] = [];


  // ==============================
  // INITIALIZE
  // ==============================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // ==============================
  // LOAD DASHBOARD DATA
  // ==============================

  loadDashboard(): void {

    this.loading = true;

    this.error = '';


    this.dashboardService
      .getDashboardData()
      .subscribe({

        next: (data) => {

          console.log(
            'DASHBOARD DATA:',
            data
          );


          this.users = data.users;

          this.products = data.products;

          this.orders = data.orders;


          // ==============================
          // TOP SELLING PRODUCTS
          // ==============================

          const productSales: {
            [productId: string]: number
          } = {};


          this.orders
            .filter(
              order =>
                order.status !== 'cancelled'
            )
            .forEach(order => {

              order.items.forEach(item => {

                const productId =
                  String(item.productId);


                if (!productSales[productId]) {

                  productSales[productId] = 0;

                }


                productSales[productId] +=
                  item.quantity;

              });

            });


          this.topSellingProducts =
            Object.entries(productSales)
              .map(
                ([productId, quantity]) => {

                  const product =
                    this.products.find(
                      product =>
                        String(product.id) ===
                        productId
                    );


                  return product
                    ? {
                      product,
                      quantity
                    }
                    : null;

                }
              )
              .filter(
                item => item !== null
              ) as {
                product: products;
                quantity: number;
              }[];


          this.topSellingProducts.sort(
            (a, b) =>
              b.quantity - a.quantity
          );


          this.topSellingProducts =
            this.topSellingProducts.slice(0, 5);


          // ==============================
          // SUMMARY CARDS
          // ==============================

          this.totalUsers =
            this.users.length;


          this.totalProducts =
            this.products.filter(
              product =>
                !product.isDeleted
            ).length;


          this.totalOrders =
            this.orders.length;


          this.totalRevenue =
            this.orders
              .filter(
                order =>
                  order.status !== 'cancelled'
              )
              .reduce(
                (total, order) =>
                  total + order.total,
                0
              );


          // ==============================
          // REVENUE CHART
          // ==============================

          this.updateRevenueChart();


          // ==============================
          // ORDER STATUS
          // ==============================

          const pendingOrders =
            this.orders.filter(
              order =>
                order.status === 'pending'
            ).length;


          const confirmedOrders =
            this.orders.filter(
              order =>
                order.status === 'confirmed'
            ).length;


          const deliveredOrders =
            this.orders.filter(
              order =>
                order.status === 'delivered'
            ).length;


          const cancelledOrders =
            this.orders.filter(
              order =>
                order.status === 'cancelled'
            ).length;


          this.orderStatusChartData = {

            labels: [
              'Pending',
              'Confirmed',
              'Delivered',
              'Cancelled'
            ],

            datasets: [
              {
                label: 'Orders',

                data: [
                  pendingOrders,
                  confirmedOrders,
                  deliveredOrders,
                  cancelledOrders
                ],

                backgroundColor: [
                  '#D4552B',
                  '#4F6D7A',
                  '#3F7D58',
                  '#B94A48'
                ],

                borderRadius: 6
              }
            ]

          };


          // ==============================
          // PRODUCT CATEGORY CHART
          // ==============================

          const categoryCounts: {
            [category: string]: number
          } = {};


          const nonCancelledOrders =
            this.orders.filter(
              order =>
                order.status !== 'cancelled'
            );


          nonCancelledOrders.forEach(
            order => {

              order.items.forEach(
                item => {

                  const product =
                    this.products.find(
                      product =>
                        String(product.id) ===
                        String(item.productId)
                    );


                  if (!product) {
                    return;
                  }


                  const category =
                    product.category;


                  if (!categoryCounts[category]) {

                    categoryCounts[category] = 0;

                  }


                  categoryCounts[category] +=
                    item.quantity;

                }
              );

            }
          );


          const categoryLabels =
            Object.keys(
              categoryCounts
            );


          const categoryData =
            Object.values(
              categoryCounts
            );


          this.productCategoryChartData = {

            labels: categoryLabels,

            datasets: [
              {
                label: 'Products Sold',

                data: categoryData,

                backgroundColor: [
                  '#D4552B',
                  '#4F6D7A',
                  '#3F7D58',
                  '#8A6D5A',
                  '#7B61A8',
                  '#C58B39',
                  '#5B7C99',
                  '#A65D5D'
                ],

                borderWidth: 2
              }
            ]

          };


          // ==============================
          // RECENT ORDERS
          // ==============================

          this.recentOrders =
            [...this.orders]
              .sort(
                (a, b) =>
                  new Date(
                    b.createdAt
                  ).getTime() -
                  new Date(
                    a.createdAt
                  ).getTime()
              )
              .slice(0, 5);


          // ==============================
          // LOW STOCK PRODUCTS
          // ==============================

          this.lowStockProducts =
            this.products
              .filter(
                product =>
                  !product.isDeleted &&
                  product.stock <= 5
              )
              .sort(
                (a, b) =>
                  a.stock - b.stock
              );


          // ==============================
          // FINISHED
          // ==============================

          this.loading = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'DASHBOARD ERROR:',
            error
          );


          this.error =
            'Failed to load dashboard data';


          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==============================
  // CHANGE REVENUE PERIOD
  // ==============================

  setRevenuePeriod(
    period: 'day' | 'week' | 'month'
  ): void {

    this.revenuePeriod = period;

    this.updateRevenueChart();

  }


  // ==============================
  // UPDATE REVENUE CHART
  // ==============================

  updateRevenueChart(): void {

    const validOrders =
      this.orders.filter(
        order =>
          order.status !== 'cancelled'
      );


    // ==============================
    // NO REVENUE DATA
    // ==============================

    if (validOrders.length === 0) {

      this.revenueChartData = {

        labels: [],

        datasets: [
          {
            label: 'Revenue',

            data: [],

            tension: 0.3,

            fill: true
          }
        ]

      };

      return;

    }


    // ==============================
    // DAY
    // ==============================

    if (
      this.revenuePeriod === 'day'
    ) {

      const dailyRevenue =
        new Map<string, number>();


      validOrders.forEach(
        order => {

          const date =
            new Date(
              order.createdAt
            );


          const year =
            date.getFullYear();


          const month =
            String(
              date.getMonth() + 1
            ).padStart(
              2,
              '0'
            );


          const day =
            String(
              date.getDate()
            ).padStart(
              2,
              '0'
            );


          const key =
            `${year}-${month}-${day}`;


          const current =
            dailyRevenue.get(
              key
            ) || 0;


          dailyRevenue.set(
            key,
            current + order.total
          );

        }
      );


      const sortedData =
        Array.from(
          dailyRevenue.entries()
        ).sort(
          (a, b) =>
            a[0].localeCompare(
              b[0]
            )
        );


      this.revenueChartData = {

        labels: sortedData.map(
          ([key]) => {

            const date =
              new Date(
                `${key}T00:00:00`
              );


            return date.toLocaleDateString(
              'en-IN',
              {
                day: 'numeric',
                month: 'short'
              }
            );

          }
        ),

        datasets: [
          {
            label: 'Revenue',

            data: sortedData.map(
              ([, total]) =>
                total
            ),

            tension: 0.3,

            fill: true
          }
        ]

      };


      return;

    }


    // ==============================
    // WEEK
    // ==============================

    if (
      this.revenuePeriod === 'week'
    ) {

      const weeklyRevenue =
        new Map<string, number>();


      validOrders.forEach(
        order => {

          const date =
            new Date(
              order.createdAt
            );


          const weekStart =
            this.getWeekStart(
              date
            );


          const year =
            weekStart.getFullYear();


          const month =
            String(
              weekStart.getMonth() + 1
            ).padStart(
              2,
              '0'
            );


          const day =
            String(
              weekStart.getDate()
            ).padStart(
              2,
              '0'
            );


          const key =
            `${year}-${month}-${day}`;


          const current =
            weeklyRevenue.get(
              key
            ) || 0;


          weeklyRevenue.set(
            key,
            current + order.total
          );

        }
      );


      const sortedData =
        Array.from(
          weeklyRevenue.entries()
        ).sort(
          (a, b) =>
            a[0].localeCompare(
              b[0]
            )
        );


      this.revenueChartData = {

        labels: sortedData.map(
          ([key]) => {

            const start =
              new Date(
                `${key}T00:00:00`
              );


            const end =
              new Date(start);


            end.setDate(
              start.getDate() + 6
            );


            const startLabel =
              start.toLocaleDateString(
                'en-IN',
                {
                  day: 'numeric',
                  month: 'short'
                }
              );


            const endLabel =
              end.toLocaleDateString(
                'en-IN',
                {
                  day: 'numeric',
                  month: 'short'
                }
              );


            return `${startLabel} - ${endLabel}`;

          }
        ),

        datasets: [
          {
            label: 'Revenue',

            data: sortedData.map(
              ([, total]) =>
                total
            ),

            tension: 0.3,

            fill: true
          }
        ]

      };


      return;

    }


    // ==============================
    // MONTH
    // ==============================

    const monthlyRevenue =
      new Map<string, number>();


    validOrders.forEach(
      order => {

        const date =
          new Date(
            order.createdAt
          );


        const year =
          date.getFullYear();


        const month =
          String(
            date.getMonth() + 1
          ).padStart(
            2,
            '0'
          );


        const key =
          `${year}-${month}`;


        const current =
          monthlyRevenue.get(
            key
          ) || 0;


        monthlyRevenue.set(
          key,
          current + order.total
        );

      }
    );


    const sortedData =
      Array.from(
        monthlyRevenue.entries()
      ).sort(
        (a, b) =>
          a[0].localeCompare(
            b[0]
          )
      );


    this.revenueChartData = {

      labels: sortedData.map(
        ([key]) => {

          const [
            year,
            month
          ] = key.split('-');


          const date =
            new Date(
              Number(year),
              Number(month) - 1,
              1
            );


          return date.toLocaleDateString(
            'en-IN',
            {
              month: 'short',
              year: 'numeric'
            }
          );

        }
      ),

      datasets: [
        {
          label: 'Revenue',

          data: sortedData.map(
            ([, total]) =>
              total
          ),

          tension: 0.3,

          fill: true
        }
      ]

    };

  }


  // ==============================
  // GET MONDAY OF THE WEEK
  // ==============================

  private getWeekStart(
    date: Date
  ): Date {

    const result =
      new Date(date);


    result.setHours(
      0,
      0,
      0,
      0
    );


    const day =
      result.getDay();


    const difference =
      day === 0
        ? -6
        : 1 - day;


    result.setDate(
      result.getDate() + difference
    );


    return result;

  }

}