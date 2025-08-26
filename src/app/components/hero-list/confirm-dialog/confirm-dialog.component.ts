import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent {
  //INPUTS / OUTPUTS
  message = input<string>('¿Estás seguro?');
  confirmAction = output<boolean>();

  onConfirm(): void {
    this.confirmAction.emit(true);
  }

  onCancel(): void {
    this.confirmAction.emit(false);
  }
}
