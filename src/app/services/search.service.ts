import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }
  private searchTextSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public searchText$: Observable<string> = this.searchTextSubject.asObservable();

  setSearchText(searchText: string) {
    this.searchTextSubject.next(searchText);
  }
}
