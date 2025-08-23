import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HeroListComponent } from './hero-list.component';
import { HeroService } from '../../services/hero-services/hero.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { Hero } from '../../models/hero.model';
import { Component } from '@angular/core';
import { UppercaseDirective } from '../../directives/uppercase.directive';

@Component({ selector: 'app-hero-form', template: '', standalone: true })
class MockHeroFormComponent {}

@Component({ selector: 'app-confirm-dialog', template: '', standalone: true })
class MockConfirmDialogComponent {}

@Component({ selector: 'app-spinner', template: '', standalone: true })
class MockSpinnerComponent {}

const heroList: Hero[] = [
  {
    id: 1,
    name: 'Superman',
    power: 'Flight',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Batman',
    power: 'Intelligence',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockHeroService = {
  getAllHeroes: () => of([...heroList]),
  createHero: (hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) =>
    of({ ...hero, id: 99, createdAt: new Date(), updatedAt: new Date() }),
  updateHero: (
    id: number,
    hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>
  ) => of({ ...hero, id, updatedAt: new Date() }),
  deleteHero: (id: number) => of(true),
};

const mockSpinnerService = { show: () => {}, hide: () => {} };

describe('HeroListComponent - Complete', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HeroListComponent,
        MockHeroFormComponent,
        MockConfirmDialogComponent,
        MockSpinnerComponent,
        UppercaseDirective,
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: SpinnerService, useValue: mockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load heroes on init', fakeAsync(() => {
    spyOn(component, 'loadHeroes').and.callThrough();
    component.ngOnInit();
    tick(500);
    expect(component.loadHeroes).toHaveBeenCalled();
    expect(component.heroes.length).toBe(heroList.length);
  }));

  it('should apply pagination correctly', () => {
    component.heroes = heroList;
    component.pageSize = 1;
    component.applyPagination();
    expect(component.filteredHeroes.length).toBe(1);
  });

  it('should search heroes', () => {
    component.heroes = heroList;
    component.searchTerm = 'super';
    component.applyPagination();
    expect(component.filteredHeroes.length).toBe(1);
    expect(component.filteredHeroes[0].name).toBe('Superman');
  });

  it('should open and close modal', () => {
    component.openAddHero();
    expect(component.showModal).toBeTrue();
    component.closeModal();
    expect(component.showModal).toBeFalse();
  });

  it('should change page size', () => {
    component.pageSize = 10;
    component.changePageSize();
    expect(component.pageSize).toBe(10);
    expect(component.pageIndex).toBe(0);
  });

  it('should create hero', fakeAsync(() => {
    spyOn(mockHeroService, 'createHero').and.callThrough();
    component.showModal = true;
    component.selectedHero = undefined;
    component.onSaveHero({ name: 'TestHero', power: 'X', description: 'Y' });
    tick();
    expect(mockHeroService.createHero).toHaveBeenCalled();
  }));

  it('should update hero', fakeAsync(() => {
    spyOn(mockHeroService, 'updateHero').and.callThrough();
    component.selectedHero = heroList[0];
    component.onSaveHero({
      name: 'Updated',
      power: component.selectedHero.power,
      description: component.selectedHero.description,
    });
    tick();
    expect(mockHeroService.updateHero).toHaveBeenCalledWith(
      heroList[0].id,
      jasmine.objectContaining({
        name: 'Updated',
        power: 'Flight',
      })
    );
  }));

  it('should delete hero after confirmation', fakeAsync(() => {
    spyOn(mockHeroService, 'deleteHero').and.callThrough();
    component.heroToDelete = heroList[0];
    component.handleDeleteConfirmation(true);
    tick();
    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(heroList[0].id);
  }));
});
