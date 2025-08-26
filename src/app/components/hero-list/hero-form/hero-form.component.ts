import { Component, OnInit, output, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Hero } from '../../../models/hero.model';
import { UppercaseDirective } from '../../../directives/uppercase.directive';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UppercaseDirective],
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.css'],
})
export class HeroFormComponent implements OnInit {
  //INJECTIONS
  private fb = inject(FormBuilder);

  //INPUTS / OUTPUTS
  readonly hero = input<Hero>();
  save = output<Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>>();
  cancel = output<void>();

  // VARIABLES
  heroForm: FormGroup;

  constructor() {
    this.heroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      power: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  ngOnInit(): void {
    const hero = this.hero();
    if (hero) {
      this.heroForm.patchValue({
        name: hero.name,
        power: hero.power,
        description: hero.description || '',
      });
    }
  }

  onSubmit(): void {
    if (this.heroForm.valid) {
      this.save.emit(this.heroForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
