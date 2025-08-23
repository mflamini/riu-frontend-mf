import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor() {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart;
    const originalValue = input.value;

    input.value = input.value.toUpperCase();
    input.setSelectionRange(cursorPosition, cursorPosition);

    if (input.value !== originalValue) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
