import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
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

  selected_tab:string = 'chats';

  constructor(private router: Router, private chatService : ChatService, private webSocketService : WebSocketService, private userService: UserService,private localStorageService: LocalStorageService) { }

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
  }

  tabs_list: any = [
    { key: 'chats', label: 'Chats', route: 'chat-box-chats' },
    { key: 'history', label: 'History', route: 'chat-box-history' },
    { key: 'invite', label: 'Invite', route: 'chat-box-invite' }
  ]

  fetchUserInfo(user_id: any) {
    this.userService.fetchUserInfo(user_id).subscribe({
      next: (res) => {
        this.user_info = res.data;
        console.log('fetch');
        console.log(this.user_info.number);
  
        
        this.webSocketService.connect(this.user_info.number);
        this.webSocketService.emit('updatedOnlineStatus', { handle: this.userDetails.user_id });
        this.webSocketService.listen('typing').subscribe((data) => this.updateFeedback(data));
        // this.webSocketService.listen('updatedOnlineStatus').subscribe((data) => this.updateOnlineStatus(data));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updateFeedback(data: any){
    clearTimeout(this.typingTimeout); 
    if (!!data && data.handle !== this.userDetails.user_id) {
      this.feedback = 'Typing...';
      this.typingTimeout = setTimeout(() => {
        this.feedback = '';
      }, 1000);
    } else {
      this.feedback = '';
    }
  }
  tabChange(data:any){
    console.log(data);
    
    this.selected_tab = data

  }

}
