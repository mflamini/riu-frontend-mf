import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Hero } from '../../models/hero.model';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroes: Hero[] = [];
  private heroesSubject = new BehaviorSubject<Hero[]>([]);
  private lastId = 0;
  private readonly storageKey = 'heroes_data';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeData();
  }

  private initializeData(): void {
    if (this.isBrowser) {
      this.loadFromLocalStorage();
    } else {
      this.initializeSampleData();
      this.heroesSubject.next([...this.heroes]);
    }
  }

  private loadFromLocalStorage(): void {
    if (!this.isBrowser) return;

    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        this.heroes = parsedData.heroes;
        this.lastId = parsedData.lastId;
      } else {
        this.initializeSampleData();
      }
      this.heroesSubject.next([...this.heroes]);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.initializeSampleData();
      this.heroesSubject.next([...this.heroes]);
    }
  }

  private saveToLocalStorage(): void {
    if (!this.isBrowser) return;

    try {
      const dataToStore = {
        heroes: this.heroes,
        lastId: this.lastId,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(dataToStore));
      this.heroesSubject.next([...this.heroes]);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      this.heroesSubject.next([...this.heroes]);
    }
  }

  private initializeSampleData(): void {
    this.heroes = [
      {
        id: 1,
        name: 'SPIDERMAN',
        power: 'Sentido arácnido, agilidad, fuerza sobrehumana',
        description: 'El hombre araña amigable del vecindario',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'IRONMAN',
        power: 'Armadura tecnológica, genio intelectual, riqueza',
        description: 'Genio, millonario, playboy, filántropo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'CAPITAN AMERICA',
        power: 'Fuerza sobrehumana, agilidad, escudo de vibranium',
        description: 'El primer vengador, símbolo de libertad',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: 'THOR',
        power: 'Dios del trueno, Mjolnir, control del clima',
        description: 'Dios nórdico del trueno de Asgard',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: 'HULK',
        power: 'Fuerza ilimitada, regeneración, invulnerabilidad',
        description: 'El hombre más fuerte de todos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: 'BLACK WIDOW',
        power: 'Maestra en artes marciales, espionaje, agilidad',
        description: 'Espía rusa y miembro de los Vengadores',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: 'BLACK PANTHER',
        power: 'Sentidos mejorados, traje de vibranium, rey de Wakanda',
        description: 'Protector de Wakanda y poseedor de la pantera negra',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: 'DOCTOR STRANGE',
        power: 'Artes místicas, manipulación de la realidad, viaje astral',
        description: 'Hechicero supremo y protector de la realidad',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        name: 'CAPITANA MARVEL',
        power: 'Vuelo, energía cósmica, fuerza sobrehumana',
        description: 'Heroína cósmica con poderes extraordinarios',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        name: 'WOLVERINE',
        power: 'Garras de adamantium, regeneración, sentidos agudizados',
        description:
          'Mutante con esqueleto de adamantium y capacidad de curación',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        name: 'DEADPOOL',
        power: 'Regeneración, cuarta pared, habilidades de combate',
        description: 'Mercenario bocazas con factor de curación',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 12,
        name: 'STORM',
        power: 'Control del clima, vuelo, manipulación atmosférica',
        description: 'Mutante que controla los elementos climáticos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.lastId = 12;
  }

  getAllHeroes(): Observable<Hero[]> {
    return of([...this.heroes]);
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return this.getAllHeroes();
    const filteredHeroes = this.heroes.filter((hero) =>
      hero.name.toLowerCase().includes(term.toLowerCase())
    );
    return of(filteredHeroes);
  }

  createHero(
    heroData: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Hero> {
    if (!heroData.name || !heroData.power) {
      return throwError(() => new Error('Invalid hero data'));
    }
    const newHero: Hero = {
      ...heroData,
      id: ++this.lastId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.heroes.push(newHero);
    this.saveToLocalStorage();
    return of(newHero);
  }
  getHeroById(id: number): Observable<Hero> {
    const hero = this.heroes.find((h) => h.id === id);
    if (!hero) return throwError(() => new Error('Hero not found'));
    return of(hero);
  }

  updateHero(id: number, heroData: Partial<Hero>): Observable<Hero> {
    const index = this.heroes.findIndex((h) => h.id === id);
    if (index === -1) return throwError(() => new Error('Hero not found'));

    this.heroes[index] = {
      ...this.heroes[index],
      ...heroData,
      updatedAt: new Date(),
    };
    this.saveToLocalStorage();
    return of({ ...this.heroes[index] });
  }

  deleteHero(id: number): Observable<boolean> {
    const index = this.heroes.findIndex((h) => h.id === id);
    if (index === -1) return throwError(() => new Error('Hero not found'));

    this.heroes.splice(index, 1);
    this.saveToLocalStorage();
    return of(true);
  }
}
