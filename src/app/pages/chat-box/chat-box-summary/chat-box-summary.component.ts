import { Component, OnInit } from '@angular/core';
import { ChildActivationStart, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Constants } from 'src/app/Constants/constants';
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
  showVideoPopup: boolean = false;
  popupData: any;
  offerData: any;
  selected_tab:string = 'chats';
  profileImage!: string;

  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router, private webSocketService : WebSocketService, private userService: UserService,private localStorageService: LocalStorageService, private searchService: SearchService) { 
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
    this.setupSocketListeners()
  }

  setupSocketListeners() {
    // In the frontend code of the receiving user (the answerer)
    this.webSocketService
      .listen('video-chat-request').pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
          if(data.userDetails.number === this.userDetails.user_number){
            this.showVideoPopup = true
            this.popupData = data.contactDetails
            if(this.popupData.avatar){
              this.getProfileImg(this.popupData.avatar)
            }
          }
        }
      );
      this.webSocketService
      .listen('video-chat-data').pipe(takeUntil(this.unsubscribe$))
      .subscribe(async(data) => {
        if(data.contactNumber === this.userDetails.user_number)
          if(data.type === 'cancel'){
            this.showVideoPopup = false
          }
      })
  }

  tabs_list: any = [
    { key: 'chats', label: 'Chats', route: 'chat-box-chats' },
    { key: 'all-chat', label: 'All Chats', route: 'chat-box-all-chat' },
    { key: 'invite', label: 'Invite', route: 'chat-box-invite' }
  ]

  shouldSkipDisconnect(url: string): boolean {
    // Define the routes where you want to skip calling disconnectAndSetOffline()
    const allowedRoutes = ['chat-box-chats', 'chat-box-all-chat', 'chat-box-invite', 'chat-page', 'chat-box'];  
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
    this.selected_tab = data
  }
  onSearch(event: any) {
    this.searchText = event.searchText;
    this.searchService.setSearchText(event.searchText);
  }
  clickSettings(){
    
  }
  async acceptVideoCall(){
    const permissions = await this.checkPermissions();
      if (!permissions.camera || !permissions.microphone) {
        // Ask for permissions if not granted
        const stream = await this.requestPermissions();
        if (stream) {
          // Proceed with WebRTC connection setup
          this.showVideoPopup = false  
          this.router.navigate(['/index/chat-box/video-chat'], { state: { popupData: this.popupData} })
        } else {
          // Handle case where permissions are denied
          console.log('Cannot proceed without permissions.');
        }
      } else {
        // Permissions already granted
        this.showVideoPopup = false  
        this.router.navigate(['/index/chat-box/video-chat'], { state: { popupData: this.popupData} })
      }
  }
  async checkPermissions() {
    const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
    const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
  
    return {
      camera: cameraPermission.state === 'granted',
      microphone: microphonePermission.state === 'granted'
    };
  }

  async requestPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      // If successful, the user granted the permissions
      return stream;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          alert('Please allow camera and microphone permissions from your browser settings to continue.');
        } else {
          console.error('Error accessing media devices:', err.message);
        }
      }
      return null;
    }
  }
  getProfileImg(url: any){
    if(url){
      this.userService.getProfile(url).subscribe((response) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.profileImage = reader.result as string;
        };
        reader.readAsDataURL(response);
      });
    }
  }
  declineCall(){
    this.showVideoPopup = false
    const payload = {
      type: 'decline-call',
      contactNumber: this.popupData.number
    };
    this.webSocketService.emit('video-chat-data',payload);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
