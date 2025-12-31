import { AfterViewInit, Component } from '@angular/core';

declare const AOS: any;

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css',
})
export class Privacy implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
  }
}
