import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { productsReducer } from './store/products/products.reducer';
import { ProductsEffects } from './store/products/products.effects';
import { cartReducer } from './store/carts/cart.reducers';
import { CartEffects } from './store/carts/cart.effects';
import { WishlistEffects } from './store/wishlists/wishlists.effects';
import { wishlistReducer } from './store/wishlists/wishlists.reducers';
import { OrderEffects } from './store/orders/orders.effects';
import { orderReducer } from './store/orders/orders.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideStore({
      products: productsReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      orders: orderReducer
    }),
   
      provideHttpClient(withFetch()),
    provideEffects(ProductsEffects, CartEffects, WishlistEffects,OrderEffects)
  ],
};
