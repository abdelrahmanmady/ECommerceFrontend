import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
showUserDropdown: boolean = false;
constructor(public cartService: CartService) {}
  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }
}
