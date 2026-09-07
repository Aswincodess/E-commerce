import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';


export const routes: Routes = [

    {
        path: 'home',
        loadComponent: () =>
            import('./features/home/home.component')
                .then(m => m.Home)
    },

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },

    {
        path: 'products',
        loadComponent: () =>
            import('./features/products/products.component')
                .then(m => m.Products)
    },

    {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/cart/cart.component/cart.component')
                .then(m => m.CartComponent)
    },

    {
        path: 'custom-build',
        loadComponent: () =>
            import('./features/custom-build/custom-build.component')
                .then(m => m.CustomBuild)
    },

    {
        path: 'login',
        loadComponent: () =>
            import('./features/login/login.component')
                .then(m => m.Login)
    },

    {
        path: 'register',
        loadComponent: () =>
            import('./features/register/register.component')
                .then(m => m.Register)
    }
];