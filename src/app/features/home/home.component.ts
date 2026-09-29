import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';

import {
  AsyncPipe
} from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import { Store } from '@ngrx/store';

import {
  selectFeaturedProducts
} from '../../store/products/products.selectors';

import {
  addToCart
} from '../../store/carts/cart.actions';

import {
  addToWishlist,
  removeFromWishlist
} from '../../store/wishlists/wishlists.actions';

import {
  selectWishlistProductIds
} from '../../store/wishlists/wishlists.selectors';

import { Auth } from '../../core/services/auth/auth.service';

import { ProductCard } from '../../shared/product-card/product-card';
import { CategoryCard } from '../../shared/category-card/category-card';

@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    RouterLink,
    AsyncPipe,
    ProductCard,
    CategoryCard
  ],

  templateUrl: './home.component.html',

  styleUrl: './home.component.css'
})


export class Home implements OnInit, OnDestroy {



  private store = inject(Store);

  private router = inject(Router);

  private auth = inject(Auth);


  //hero slidedown

  heroImages: string[] = [
    '/images/hero-workspace.jpg',
    '/images/hero-workspace-1.jpg',
    '/images/hero-workspace-2.jpg'
  ];

  heroContent = [
    {
      label: 'WORK SETUP',
      title: 'Built for Focus.',
      description: 'Create a workspace where distractions disappear.'
    },
    {
      label: 'CREATOR SETUP',
      title: 'Make Room for Ideas.',
      description: 'A setup designed to keep your creativity moving.'
    },
    {
      label: 'PERFORMANCE SETUP',
      title: 'Power Your Setup.',
      description: 'Bring the performance you need to your workspace.'
    }
  ];

  currentSlide = signal(0);

  private slideInterval: any;


  // shop by category (floating carousel)

  shopCategories = [
    {
      key: 'chairs',
      name: 'Office Chairs',
      description: 'Ergonomic comfort for every workday.',
      image: '/images/chair.webp'
    },
    {
      key: 'laptops',
      name: 'Laptops',
      description: 'Powerful laptops for work and productivity.',
      image: '/images/laptop.webp'
    },
    {
      key: 'monitors',
      name: 'Monitors',
      description: 'Sharper views. Better productivity.',
      image: '/images/monitor.webp'
    },
    {
      key: 'pcs',
      name: 'PCs',
      description: 'Powerful desktop PCs for demanding work.',
      image: '/images/cpu.webp'
    }
  ];

  catIndex = signal(0);

  private catInterval: any;


  //featured products
  featuredProducts$ =
    this.store.select(selectFeaturedProducts);

  //
  wishlistProductIds$ =
    this.store.select(selectWishlistProductIds);



  ngOnInit(): void {

    this.slideInterval = setInterval(() => {

      this.currentSlide.update(
        (index: number) =>
          (index + 1) % this.heroImages.length
      );

    }, 5000);

    this.catInterval = setInterval(() => {

      this.catIndex.update(
        (index: number) =>
          (index + 1) % this.shopCategories.length
      );

    }, 3400);

  }



  ngOnDestroy(): void {

    clearInterval(this.slideInterval);

    clearInterval(this.catInterval);

  }



  // category carousel: position of each item (center / right / left / hidden)
  catPos(i: number): string {

    const n = this.shopCategories.length;

    const d = (i - this.catIndex() + n) % n;

    return d === 0 ? 'c'
      : d === 1 ? 'r'
        : d === n - 1 ? 'l'
          : 'h';

  }

  // category carousel: tilt the centre item toward the cursor
  catTilt(e: MouseEvent): void {

    const s = e.currentTarget as HTMLElement;

    const r = s.getBoundingClientRect();

    s.style.setProperty(
      '--crx',
      -((e.clientY - r.top) / r.height - 0.5) * 10 + 'deg'
    );

    s.style.setProperty(
      '--cry',
      ((e.clientX - r.left) / r.width - 0.5) * 14 + 'deg'
    );

  }

  catUntilt(e: MouseEvent): void {

    const s = e.currentTarget as HTMLElement;

    s.style.setProperty('--crx', '0deg');

    s.style.setProperty('--cry', '0deg');

  }



  addToCart(product: any): void {

    // User must be logged in
    if (!this.auth.currentUser()) {

      this.router.navigate(['/login']);

      return;
    }


    // Add product to cart
    this.store.dispatch(
      addToCart({ product })
    );

  }

  toggleWishlist(
    productId: number,
    wishlistIds: number[]
  ): void {

    // User must be logged in
    if (!this.auth.currentUser()) {

      this.router.navigate(['/login']);

      return;
    }


    // Remove from wishlist
    if (wishlistIds.includes(productId)) {

      this.store.dispatch(
        removeFromWishlist({
          productId
        })
      );

    }

    // Add to wishlist
    else {

      this.store.dispatch(
        addToWishlist({
          productId
        })
      );

    }

  }

}