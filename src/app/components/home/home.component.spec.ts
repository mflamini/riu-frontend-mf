import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentIndex to 0', () => {
    expect(component.currentIndex).toBe(0);
  });

  it('should go to next image', () => {
    component.currentIndex = 0;
    component.next();
    expect(component.currentIndex).toBe(1);

    component.currentIndex = component.images.length - 1;
    component.next();
    expect(component.currentIndex).toBe(0);
  });

  it('should go to previous image', () => {
    component.currentIndex = 0;
    component.prev();
    expect(component.currentIndex).toBe(component.images.length - 1);

    component.currentIndex = 2;
    component.prev();
    expect(component.currentIndex).toBe(1);
  });

  it('should go to specific index', () => {
    component.goTo(3);
    expect(component.currentIndex).toBe(3);

    component.goTo(0);
    expect(component.currentIndex).toBe(0);
  });

  it('should start carousel and change images automatically', fakeAsync(() => {
    spyOn(component, 'next').and.callThrough();
    component.startCarousel();
    expect(component.intervalId).toBeDefined();

    tick(3000);
    expect(component.next).toHaveBeenCalledTimes(1);
    tick(3000);
    expect(component.next).toHaveBeenCalledTimes(2);

    clearInterval(component.intervalId);
  }));

  it('should clear interval on destroy', () => {
    component.startCarousel();
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalledWith(component.intervalId);
  });
});
