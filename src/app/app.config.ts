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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideStore({
      products: productsReducer,
      cart: cartReducer
    }),
   
      provideHttpClient(withFetch()),
    provideEffects(ProductsEffects, CartEffects)
  ],
};
