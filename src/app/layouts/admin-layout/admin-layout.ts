import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header}  from './header/header';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Header],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

}
