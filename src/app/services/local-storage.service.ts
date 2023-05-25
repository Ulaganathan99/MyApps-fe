import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  onChange: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    this.onChange.next(key);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.onChange.next(key);
  }
}