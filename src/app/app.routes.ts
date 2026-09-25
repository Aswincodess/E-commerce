import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard-guard';
import { NotFound } from './features/not-found/not-found';
import { adminGuard } from './core/guards/admin-guard';
import { EditProductComponent } from './features/admin/products/edit-product/edit-product.component';
import { ProfileComponent } from './features/profile/profile';

export const routes: Routes = [

    // public pages
    {
        path: 'home',
        loadComponent: () =>
            import('./features/home/home.component')
                .then(m => m.Home)
    },

    {
        path: 'products',
        loadComponent: () =>
            import('./features/products/products.component')
                .then(m => m.Products)
    },

    {
        path: 'products/:id',
        loadComponent: () =>
            import('./features/product-details/product-details.component')
                .then(m => m.ProductDetails)
    },


    // auth for login and register
    {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
            import('./features/login/login.component')
                .then(m => m.Login)
    },

    {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
            import('./features/register/register.component')
                .then(m => m.Register)
    },


    // protected pages
    {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/cart/cart.component/cart.component')
                .then(m => m.CartComponent)
    },

    {
        path: 'wishlist',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/wishlist/wishlist.component')
                .then(m => m.Wishlists)
    },

    {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/checkout/checkout.component')
                .then(m => m.CheckoutComponent)
    },

    {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/orders/orders.component')
                .then(m => m.Orders)
    },

    {
        path: 'order-success',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/order-success/order-success.component')
                .then(m => m.OrderSuccess)
    },

    {
        path: 'profile',
        component: ProfileComponent
    },


    // admin routing
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
            import('./features/admin/admin/admin.component')
                .then(m => m.Admin),

        children: [

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/admin/dashboard/dashboard.component')
                        .then(m => m.DashboardComponent)
            },

            {
                path: 'products',
                loadComponent: () =>
                    import('./features/admin/products/products.component')
                        .then(m => m.ProductsComponent)
            },

            {
                path: 'products/add',
                loadComponent: () =>
                    import('./features/admin/products/add-products/add-products.component')
                        .then(m => m.AddProductComponent)
            },

            {
                path: 'products/edit/:id',
                loadComponent: () =>
                    import('./features/admin/products/edit-product/edit-product.component')
                        .then(m => m.EditProductComponent)
            },

            {
                path: 'products/:id',
                loadComponent: () =>
                    import('./features/product-details/product-details.component')
                        .then(m => m.ProductDetails)
            },

            {
                path: 'orders',
                loadComponent: () =>
                    import('./features/admin/orders/orders.component')
                        .then(m => m.OrdersComponent)
            },

            {
                path: 'orders/:id',
                loadComponent: () =>
                    import('./features/admin/orders/orders-detail/orders-detail.component')
                        .then(m => m.OrderDetailsComponent)
            },

            {
                path: 'users',
                loadComponent: () =>
                    import('./features/admin/users/users.component')
                        .then(m => m.UsersComponent)
            },

            {
                path: 'users/:id',
                loadComponent: () =>
                    import('./features/admin/users/user-details/user-details')
                        .then(m => m.UserDetailsComponent)
            }

        ]
    },


    // default routes
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },

    {
        path: '**',
        loadComponent: () =>
            import('./features/not-found/not-found')
                .then(m => m.NotFound)
    }

];