import { Component, OnInit } from '@angular/core';
import { ChildActivationStart, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-chat-box-summary',
  templateUrl: './chat-box-summary.component.html',
  styleUrls: ['./chat-box-summary.component.scss']
})
export class ChatBoxSummaryComponent implements OnInit {

  currentRoute!: string | null;
  userDetails: any;
  user_info!: any;
  feedback!: string;
  typingTimeout: any; 
  onlineStatusInfo!: any;
  searchText: any;

  selected_tab:string = 'chats';

  constructor(private router: Router, private chatService : ChatService, private webSocketService : WebSocketService, private userService: UserService,private localStorageService: LocalStorageService, private searchService: SearchService) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = (event as NavigationEnd).url;
        if (!this.shouldSkipDisconnect(url)) {
          this.disconnectAndSetOffline();
        }
      }
    });
  }

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
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.fetchChatInfo(this.userDetails.user_id);
  }

  tabs_list: any = [
    { key: 'chats', label: 'Chats', route: 'chat-box-chats' },
    { key: 'history', label: 'History', route: 'chat-box-history' },
    { key: 'invite', label: 'Invite', route: 'chat-box-invite' }
  ]

  shouldSkipDisconnect(url: string): boolean {
    // Define the routes where you want to skip calling disconnectAndSetOffline()
    const allowedRoutes = ['chat-box-chats', 'chat-box-history', 'chat-box-invite', 'chat-page', 'chat-box'];  
    return allowedRoutes.some(route => url.includes(route));
  }

  disconnectAndSetOffline() {
    if (this.user_info && this.user_info.number) {
      this.webSocketService.disconnect(this.user_info.number);
      this.webSocketService.emit('updatedOnlineStatus', { handle: this.userDetails.user_id });
    } 

  }

  fetchChatInfo(user_id: any) {
    this.userService.fetchUserInfo(user_id).subscribe({
      next: (res) => {
        this.user_info = res.data;
        this.webSocketService.connect(this.user_info.number);
        this.webSocketService.emit('updatedOnlineStatus', { handle: this.userDetails.user_id });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
 
 
  tabChange(data:any){
    console.log(data);
    
    this.selected_tab = data

  }
  onSearch(event: any) {

    this.searchText = event.searchText;
    console.log(this.searchText);
    this.searchService.setSearchText(event.searchText);
    // this.fetchAllQuotes({});
  }

}
