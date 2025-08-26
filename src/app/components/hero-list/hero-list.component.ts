import { Component, OnInit, inject } from '@angular/core';
import { Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero-services/hero.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroFormComponent } from './hero-form/hero-form.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs/operators';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { UppercaseDirective } from '../../directives/uppercase.directive';

@Component({
  selector: 'app-hero-list',
  imports: [
    CommonModule,
    FormsModule,
    HeroFormComponent,
    ConfirmDialogComponent,
    SpinnerComponent,
    UppercaseDirective,
  ],
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.css'],
  standalone: true,
})
export class HeroListComponent implements OnInit {
  //INJECTIONS
  private heroService = inject(HeroService);
  private spinnerService = inject(SpinnerService);

  //VARIABLES
  heroes: Hero[] = [];
  filteredHeroes: Hero[] = [];
  searchTerm = '';
  pageSizes = [5, 10, 20, 50];
  pageSize = 5;
  pageIndex = 0;
  showModal = false;
  selectedHero: Hero | undefined = undefined;
  showConfirmDialog = false;
  heroToDelete: Hero | undefined;

  constructor() {}

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes(): void {
    this.spinnerService.show();
    this.heroService
      .getAllHeroes()
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: (heroes) => {
          this.heroes = heroes;
          this.applyPagination();
        },
        error: (error) => {
          console.error('Error loading heroes:', error);
        },
      });
  }

  changePageSize(): void {
    this.pageIndex = 0;
    this.applyPagination();
  }

  search(event: any): void {
    this.pageIndex = 0;
    this.applyPagination();
  }

  applyPagination(): void {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.heroes.filter((h) =>
      h.name.toLowerCase().includes(term)
    );
    const start = this.pageIndex * this.pageSize;
    this.filteredHeroes = filtered.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.applyPagination();
    }
  }

  nextPage(): void {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.heroes.filter((h) =>
      h.name.toLowerCase().includes(term)
    );
    if ((this.pageIndex + 1) * this.pageSize < filtered.length) {
      this.pageIndex++;
      this.applyPagination();
    }
  }

  openAddHero(): void {
    this.selectedHero = undefined;
    this.showModal = true;
  }

  editHero(hero: Hero): void {
    this.selectedHero = hero;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSaveHero(heroData: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) {
    this.spinnerService.show();

    if (this.selectedHero) {
      this.heroService
        .updateHero(this.selectedHero.id, heroData)
        .pipe(finalize(() => this.spinnerService.hide()))
        .subscribe({
          next: () => {
            this.loadHeroes();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating hero:', error);
          },
        });
    } else {
      const maxId = this.getMaxHeroId();
      const newHero = {
        ...heroData,
        id: maxId + 1,
      };
      this.heroService
        .createHero(newHero)
        .pipe(finalize(() => this.spinnerService.hide()))
        .subscribe({
          next: () => {
            this.loadHeroes();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error creating hero:', error);
          },
        });
    }
  }

  private getMaxHeroId(): number {
    if (!this.heroes || this.heroes.length === 0) {
      return 0;
    }
    return Math.max(...this.heroes.map((hero) => hero.id));
  }

  deleteHero(hero: Hero): void {
    this.heroToDelete = hero;
    this.showConfirmDialog = true;
  }

  handleDeleteConfirmation(confirmed: boolean) {
    if (confirmed && this.heroToDelete) {
      this.spinnerService.show();
      this.heroService
        .deleteHero(this.heroToDelete.id)
        .pipe(finalize(() => this.spinnerService.hide()))
        .subscribe({
          next: () => {
            this.loadHeroes();
          },
          error: (error) => {
            console.error('Error deleting hero:', error);
          },
        });
    }
    this.showConfirmDialog = false;
    this.heroToDelete = undefined;
  }
}
