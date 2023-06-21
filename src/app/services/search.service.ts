import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }
  private searchTextSubject: Subject<string> = new Subject<string>();
  public searchText$: Observable<string> = this.searchTextSubject.asObservable();

  setSearchText(searchText: string) {
    this.searchTextSubject.next(searchText);
  }
}
