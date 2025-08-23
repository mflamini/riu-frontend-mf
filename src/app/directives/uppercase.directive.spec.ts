import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UppercaseDirective } from './uppercase.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input type="text" appUppercase />`,
  standalone: true,
  imports: [UppercaseDirective],
})
class TestComponent {}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, UppercaseDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should convert input value to uppercase', () => {
    inputEl.value = 'test';

    const event = new Event('input');
    inputEl.dispatchEvent(event);

    expect(inputEl.value).toBe('TEST');
  });

  it('should keep cursor position after conversion', () => {
    inputEl.value = 'test';
    inputEl.setSelectionRange(2, 2);

    const event = new Event('input');
    inputEl.dispatchEvent(event);

    expect(inputEl.selectionStart).toBe(2);
    expect(inputEl.selectionEnd).toBe(2);
  });

  it('should dispatch input event if value changed', () => {
    inputEl.value = 'abc';
    const spyEvent = spyOn(inputEl, 'dispatchEvent').and.callThrough();

    inputEl.dispatchEvent(new Event('input'));

    expect(spyEvent).toHaveBeenCalled();
  });

  it('should not dispatch input event if value did not change', () => {
    inputEl.value = 'ABC';
    const spyEvent = spyOn(inputEl, 'dispatchEvent').and.callThrough();

    inputEl.dispatchEvent(new Event('input'));

    expect(spyEvent.calls.count()).toBe(1);
  });
});
