import { Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { loadProducts } from './store/products/products.actions';
import { Navbar } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private store = inject(Store);

  constructor() {
    afterNextRender(() => {
      this.store.dispatch(loadProducts());
    });
  }
}