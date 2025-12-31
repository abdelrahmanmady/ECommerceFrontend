import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

declare const AOS: any;

@Component({
  selector: 'app-support',
  imports: [RouterLink],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
  }
}
