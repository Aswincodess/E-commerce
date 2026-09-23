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

import { CategoryCard } from '../../shared/category-card/category-card';

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

import { Auth } from '../../core/services/auth.service';

import { ProductCard } from '../../shared/product-card/product-card';


@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    RouterLink,
    CategoryCard,
    AsyncPipe,
    
    ProductCard
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

  }


  
  ngOnDestroy(): void {

    clearInterval(this.slideInterval);

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