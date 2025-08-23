import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroFormComponent } from './hero-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Hero } from '../../../models/hero.model';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeroFormComponent HTML & Form', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HeroFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;

    (component as any).hero = () => null;
    (component as any).save = new EventEmitter<any>();
    (component as any).cancel = new EventEmitter<void>();

    fixture.detectChanges();
  });

  it('should show correct placeholders and labels', () => {
    const nameInput = fixture.debugElement.query(
      By.css('input[formControlName="name"]')
    ).nativeElement;
    const powerInput = fixture.debugElement.query(
      By.css('input[formControlName="power"]')
    ).nativeElement;
    const descInput = fixture.debugElement.query(
      By.css('textarea[formControlName="description"]')
    ).nativeElement;

    expect(nameInput.placeholder).toBe('Ej: SUPERMAN');
    expect(powerInput.placeholder).toBe('Ej: Super fuerza, vuelo');
    expect(descInput.placeholder).toBe('Ej: El hombre de acero');

    const labels = fixture.debugElement.queryAll(By.css('label'));
    expect(labels[0].nativeElement.textContent).toBe('Nombre');
    expect(labels[1].nativeElement.textContent).toBe('Poder');
    expect(labels[2].nativeElement.textContent).toContain('Descripción');
  });

  it('should show validation errors for invalid name and power', () => {
    const nameControl = component.heroForm.get('name');
    const powerControl = component.heroForm.get('power');

    nameControl?.setValue('');
    nameControl?.markAsTouched();
    powerControl?.setValue('Ab');
    powerControl?.markAsTouched();

    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('.error span');

    const errorSpans = Array.from(errors) as HTMLElement[];

    const nameRequiredError = errorSpans.some((span) =>
      span.textContent?.includes('El nombre es obligatorio')
    );
    expect(nameRequiredError).toBeTrue();

    const powerMinlengthError = errorSpans.some((span) =>
      span.textContent?.includes('Debe tener al menos 3 caracteres')
    );
    expect(powerMinlengthError).toBeTrue();
  });

  it('should disable submit button when form is invalid', () => {
    component.heroForm.setValue({ name: '', power: '', description: '' });
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitBtn.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', () => {
    component.heroForm.setValue({
      name: 'Batman',
      power: 'Martial Arts',
      description: 'Rich',
    });
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitBtn.disabled).toBeFalse();
  });

  it('should display correct button text for create or update', () => {
    (component as any).hero = () => null;
    fixture.detectChanges();
    let submitBtn = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitBtn.textContent.trim()).toBe('Crear');

    const mockHero: Hero = {
      id: 1,
      name: 'Superman',
      power: 'Flight',
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (component as any).hero = () => mockHero;
    component.ngOnInit();
    fixture.detectChanges();
    submitBtn = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitBtn.textContent.trim()).toBe('Actualizar');
  });

  it('should emit save on submit if form is valid', () => {
    spyOn((component as any).save, 'emit');
    component.heroForm.setValue({
      name: 'Batman',
      power: 'Martial Arts',
      description: 'Rich',
    });
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    submitBtn.click();

    expect((component as any).save.emit).toHaveBeenCalledWith({
      name: 'Batman',
      power: 'Martial Arts',
      description: 'Rich',
    });
  });

  it('should emit cancel when cancel button is clicked', () => {
    spyOn((component as any).cancel, 'emit');
    const cancelBtn = fixture.debugElement.query(
      By.css('button[type="button"]')
    ).nativeElement;
    cancelBtn.click();
    expect((component as any).cancel.emit).toHaveBeenCalled();
  });
});
