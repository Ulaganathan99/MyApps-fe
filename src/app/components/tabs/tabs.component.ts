import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  @Input() tab_list!: any;
  @Input() default_selected!: any;
  @Output() tab_change = new EventEmitter<any>();
  @Output() tab_key = new EventEmitter<any>();

  selected_tab: string = '';

  constructor(private localStorageService: LocalStorageService,
    private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem(Constants.APP.SELECTED_TAB)) {
      this.selected_tab = JSON.parse(localStorage.getItem(Constants.APP.SELECTED_TAB) || "{}");
    } else {
      this.selected_tab = (this.default_selected) ? this.default_selected : this.tab_list[0].key;
    }
  
    // Subscribe to router navigation events
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Get the current route URL
      const currentUrl = event.url;
      // Find the matching tab based on the route
      const activeTab = this.tab_list.find((tab: { route: string; }) => {
        if (tab.route) {
          return currentUrl.endsWith(tab.route);
        }
        return false;
      });
  
      if (activeTab) {
        this.selected_tab = activeTab.key; 
      }
    });
  }

  tabChange(key: string) {
    this.tab_key.emit(key);
    this.tab_change.emit(key);
    this.selected_tab = key;
    this.localStorageService.setItem(Constants.APP.SELECTED_TAB,JSON.stringify(this.selected_tab));
    this.localStorageService.removeItem(Constants.APP.SELECTED_PROFILE_TAB);
  }

  

}
