import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { HeroService } from './hero.service';
import { of, throwError } from 'rxjs';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    let store: { [key: string]: string } = {};
    const mockLocalStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => (store[key] = value),
      removeItem: (key: string) => delete store[key],
      clear: () => (store = {}),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [HeroService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(HeroService);
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => expect(service).toBeTruthy());

  it('should get all heroes', (done) => {
    service.getAllHeroes().subscribe((heroes) => {
      expect(heroes.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should get hero by valid id', (done) => {
    service.getAllHeroes().subscribe((heroes) => {
      const heroId = heroes[0]?.id;
      if (!heroId) {
        fail('No heroes found');
        done();
        return;
      }
      service.getHeroById(heroId).subscribe((hero) => {
        expect(hero).toBeDefined();
        expect(hero?.id).toBe(heroId);
        done();
      });
    });
  });

  it('should throw error for invalid hero id', (done) => {
    service.getHeroById(999).subscribe({
      next: () => fail('Should have thrown'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('should create hero and increase count', (done) => {
    service.getAllHeroes().subscribe((before) => {
      service
        .createHero({ name: 'New', power: 'X', description: 'Y' })
        .subscribe((hero) => {
          expect(hero.name).toBe('New');
          service.getAllHeroes().subscribe((after) => {
            expect(after.length).toBe(before.length + 1);
            done();
          });
        });
    });
  });

  it('should update existing hero', (done) => {
    service.getAllHeroes().subscribe((heroes) => {
      const hero = heroes[0];
      if (!hero) {
        fail('No heroes found');
        done();
        return;
      }
      service.updateHero(hero.id, { name: 'Updated' }).subscribe((updated) => {
        expect(updated?.name).toBe('Updated');
        done();
      });
    });
  });

  it('should throw error when updating non-existent hero', (done) => {
    service.updateHero(999, { name: 'Nope' }).subscribe({
      next: () => fail('Should have thrown'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('should delete existing hero', (done) => {
    service.getAllHeroes().subscribe((heroes) => {
      const hero = heroes[0];
      service.deleteHero(hero.id).subscribe((res) => {
        expect(res).toBeTrue();
        done();
      });
    });
  });

  it('should throw error when deleting non-existent hero', (done) => {
    service.deleteHero(999).subscribe({
      next: () => fail('Should have thrown'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('should search heroes correctly (case insensitive)', (done) => {
    service.searchHeroes('SPIDER').subscribe((results) => {
      expect(results.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return all heroes if search term is empty', (done) => {
    service.searchHeroes('  ').subscribe((results) => {
      expect(results.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should throw error when creating hero with invalid data', (done) => {
    service.createHero({ name: '', power: '', description: '' }).subscribe({
      next: () => fail('Should have thrown'),
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });
});
