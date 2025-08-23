import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message', () => {
    fixture.detectChanges();
    const messageEl = fixture.debugElement.query(By.css('p'));
    expect(messageEl.nativeElement.textContent).toContain('¿Estás seguro?');
  });

  it('should emit true when onConfirm is called', () => {
    spyOn(component.confirmAction, 'emit');

    component.onConfirm();

    expect(component.confirmAction.emit).toHaveBeenCalledWith(true);
  });

  it('should emit false when onCancel is called', () => {
    spyOn(component.confirmAction, 'emit');

    component.onCancel();

    expect(component.confirmAction.emit).toHaveBeenCalledWith(false);
  });
});
