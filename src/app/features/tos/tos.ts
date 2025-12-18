import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

declare const AOS: any;

@Component({
  selector: 'app-tos',
  imports: [RouterLink],
  templateUrl: './tos.html',
  styleUrl: './tos.css',
})
export class Tos implements AfterViewInit {
  ngAfterViewInit(): void {
    // Refresh AOS to detect already-visible elements after navigation
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
  }
}

