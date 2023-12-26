import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Constants } from 'src/app/Constants/constants';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {
  @Input() tab_list!: any;
  @Input() default_selected!: string;
  @Input() tab_type!: string;
  @Input() tab_size!: string;
  @Input() boxed: string | undefined;
  @Input() toggle: string | undefined;
  @Input() toggle_rounded: string | undefined;
  @Input() full_width: string | undefined;
  @Input() centered: string | undefined;
  @Input() right: string | undefined;
  @Output() tab_change = new EventEmitter<any>();
  @Output() tab_key = new EventEmitter<any>();

  selected_tab: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem(Constants.APP.SELECTED_TAB)) {
      this.selected_tab = JSON.parse(
        localStorage.getItem(Constants.APP.SELECTED_TAB) || '{}'
      );
    } else {
      this.selected_tab = this.default_selected
        ? this.default_selected
        : this.tab_list[0].key;
    }

    // Subscribe to router navigation events
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        // Get the current route URL
        const currentUrl = event.url;

        // Find the matching tab based on the route
        const activeTab = this.tab_list.find((tab: { route: string }) => {
          if (tab.route) {
            return currentUrl.startsWith(tab.route);
          }
          return false;
        });

        if (activeTab) {
          this.selected_tab = activeTab.key;
        }
      });
  }

  getClass() {
    let classes = [];

    this.tab_type && this.tab_type == 'main'
      ? classes.push('main-tabs')
      : classes.push('tabs');

    if (
      this.tab_size &&
      ['small', 'medium', 'large'].includes(this.tab_size.toLowerCase())
    )
      classes.push(`is-${this.tab_size.toLowerCase()}`);

    if (this.boxed == '') classes.push('is-boxed');
    else if (this.toggle == '')
      classes.push(
        `is-toggle ${this.toggle_rounded == '' ? 'is-toggle-rounded' : ''}`
      );

    if (this.full_width == '') classes.push('is-fullwidth');
    else if (this.centered == '') classes.push('is-centered');
    else if (this.right == '') classes.push('is-right');

    return classes.join(' ');
  }

  tabChange(key: string) {
    this.tab_key.emit(key);
    this.tab_change.emit(key);
    this.selected_tab = key;
    localStorage.setItem(
      Constants.APP.SELECTED_TAB,
      JSON.stringify(this.selected_tab)
    );
    localStorage.removeItem(Constants.APP.SELECTED_PROFILE_TAB);
  }
}
