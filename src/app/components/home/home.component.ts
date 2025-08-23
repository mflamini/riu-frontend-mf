import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  images = [
    'https://picsum.photos/id/1018/1000/600/',
    'https://picsum.photos/id/1015/1000/600/',
    'https://picsum.photos/id/1019/1000/600/',
    'https://picsum.photos/id/1020/1000/600/',
    'https://picsum.photos/id/1021/1000/600/',
  ];

  currentIndex = 0;
  intervalId: any;

  ngOnInit() {
    this.startCarousel();
    console.log(window.innerWidth);
    console.log(window.innerHeight);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }
}
