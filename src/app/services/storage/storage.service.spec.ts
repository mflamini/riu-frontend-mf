import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { StorageService } from './storage.service';
import { isPlatformBrowser } from '@angular/common';

describe('StorageService', () => {
  let service: StorageService;

  describe('Browser Environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
      });
      service = TestBed.inject(StorageService);

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jasmine.createSpy('getItem').and.returnValue('mockValue'),
          setItem: jasmine.createSpy('setItem'),
          removeItem: jasmine.createSpy('removeItem'),
        },
        writable: true,
      });
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get item from localStorage', () => {
      const result = service.getItem('testKey');
      expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
      expect(result).toBe('mockValue');
    });

    it('should handle empty string correctly', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('');
      const result = service.getItem('emptyKey');
      expect(result).toBe('');
    });

    it('should set item in localStorage', () => {
      service.setItem('testKey', 'testValue');
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
    });

    it('should remove item from localStorage', () => {
      service.removeItem('testKey');
      expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('should return null for non-existent key', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      const result = service.getItem('nonExistentKey');
      expect(result).toBeNull();
    });
  });

  describe('Server Environment (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      service = TestBed.inject(StorageService);
    });

    it('should return null when getting item on server', () => {
      expect(service.getItem('anyKey')).toBeNull();
    });

    it('should not throw error when setting item on server', () => {
      expect(() => service.setItem('anyKey', 'value')).not.toThrow();
    });

    it('should not throw error when removing item on server', () => {
      expect(() => service.removeItem('anyKey')).not.toThrow();
    });
  });
});
