import { AfterViewInit, Component } from '@angular/core';

declare const AOS: any;

@Component({
  selector: 'app-return-policy',
  imports: [],
  templateUrl: './return-policy.html',
  styleUrl: './return-policy.css',
})
export class ReturnPolicy implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
  }
}
