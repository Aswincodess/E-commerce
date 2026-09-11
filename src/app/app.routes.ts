import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard-guard';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [

   //public pages here
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


   //auth for login and register
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


   //protected page

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


   //default routes
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },

    {
        path: '**',
        loadComponent: () =>    /// i implemented it for error
            import('./features/not-found/not-found')
                .then(m => m.NotFound)
    }

];