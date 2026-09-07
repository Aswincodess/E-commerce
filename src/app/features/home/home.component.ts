import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryCard } from '../../shared/category-card/category-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink,CategoryCard],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class Home {

  
}
