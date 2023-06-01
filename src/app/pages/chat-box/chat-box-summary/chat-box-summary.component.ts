import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-chat-box-summary',
  templateUrl: './chat-box-summary.component.html',
  styleUrls: ['./chat-box-summary.component.scss']
})
export class ChatBoxSummaryComponent implements OnInit {

  currentRoute!: string | null;

  selected_tab:string = 'chats';

  constructor(private router: Router,private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    if(this.localStorageService.getItem('currentRoute')){
      this.currentRoute = this.localStorageService.getItem('currentRoute')
    }
    this.router.events.subscribe((event:any) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        localStorage.setItem('currentRoute', this.currentRoute); 
      }
    });
  }

  tabs_list: any = [
    { key: 'chats', label: 'Chats', route: 'chat-box-chats' },
    { key: 'history', label: 'History', route: 'chat-box-history' },
    { key: 'invite', label: 'Invite', route: 'chat-box-invite' }
  ]

  tabChange(data:any){
    console.log(data);
    
    this.selected_tab = data

  }

}
