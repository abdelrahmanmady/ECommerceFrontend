import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
showUserDropdown: boolean = false;

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }
}
