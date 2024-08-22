import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Constants } from 'src/app/Constants/constants';
import { Utils } from 'src/app/common/utils';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-chat-box-video-chat',
  templateUrl: './chat-box-video-chat.component.html',
  styleUrls: ['./chat-box-video-chat.component.scss']
})
export class ChatBoxVideoChatComponent implements OnInit {
  @ViewChild('localVideo')
  localVideo!: ElementRef;
  @ViewChild('remoteVideo')
  remoteVideo!: ElementRef;
  userDetails: any;
  contactDetails: any;
  localStream: any;
  remoteStream: any;
  transmitStream: any;
  configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },

    ],
    iceCandidatePoolSize: 10,
  };
  connection!: RTCPeerConnection;
  remoteProfileImage!: string;
  localProfileImage!: string;
  audioEnable: boolean = true;
  videoEnable: boolean= true;
  remoteStreamEnable: boolean = true;
  private unsubscribe$ = new Subject<void>();
 
  constructor(private webSocketService: WebSocketService, private router: Router, private userService: UserService, private utils: Utils) { }

  async ngOnInit(){
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    
    if (history.state.contactDetails != undefined) {      
      this.contactDetails = history.state.contactDetails;      
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true, 
      });
      this.localVideo.nativeElement.srcObject = this.localStream;
    } else if (history.state.popupData != undefined) {      
      this.contactDetails = history.state.popupData
      this.webSocketService.emit('video-chat-accept',{
        accept_user : this.userDetails.user_number
      })
    }else {
      this.router.navigate(['/index/chat-box']) 
    }
    this.setupSocketListeners()
    this.getProfileImg(this.contactDetails.avatar)

  }
  setupSocketListeners() {
      this.webSocketService
      .listen('video-chat-data').pipe(takeUntil(this.unsubscribe$))
      .subscribe(async(data) => {
        if(data.contactNumber === this.userDetails.user_number)
        this._handleMessage(data)
      
      })
      this.webSocketService
      .listen('video-chat-accept').pipe(takeUntil(this.unsubscribe$))
      .subscribe(async(data) => {
        if(data.accept_user == this.contactDetails.number){
          this.createOffer()
        }
      })
  }

  private async _handleMessage(data: any){
    switch (data.type) {
      case 'offer':
        this.createAnswer(data.offer)
        break;

      case 'answer':
        this.addAnswer(data.answer)
        break;
      case 'candidate':
          if(this.connection){
            this.connection.addIceCandidate(data.candidate)
          }
        break;
      case 'video-action':
        if(data.enable){
          this.remoteStreamEnable = true
        }else{
          this.remoteStreamEnable = false
        }
      break;
      case 'decline-call':
        if (this.connection) {
          this.connection.close(); // Close the connection
        }
        this.stopTracking()
        this.router.navigate(['/index/chat-box'])
        this.utils.openErrorSnackBar(`${this.contactDetails.name} call declined`)
      break;
      case 'cancel':
        if (this.connection) {
          this.connection.close(); // Close the connection
        }
        this.stopTracking()
        this.router.navigate(['/index/chat-box'])
      break;

      default:
        break;
    }
  }

  public async createPeerConnection(){
    this.connection = new RTCPeerConnection(this.configuration)
    this.remoteStream = new MediaStream();
    this.remoteVideo.nativeElement.srcObject = this.remoteStream;

    if(!this.localStream){
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
      // Display local stream in UI
      this.localVideo.nativeElement.srcObject = this.localStream;
    }
    if(!this.transmitStream){
      this.transmitStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true },
        video: true,
      });
    }
    if(!this.audioEnable){
      this.transmitStream.getAudioTracks().forEach((track: { enabled: boolean; }) => {
        track.enabled = false; // Toggle audio track
      });
    }
    if(!this.videoEnable){
      this.transmitStream.getVideoTracks().forEach((track: { enabled: boolean; }) => {
        track.enabled = false; // Toggle video track
      });
    }
    this.transmitStream.getTracks().forEach((track: MediaStreamTrack) => {
      this.connection.addTrack(track, this.transmitStream);
    });
    this.connection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
    };

    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        const payload = {
          type: 'candidate',
          candidate: event.candidate.toJSON(),
          contactNumber: this.contactDetails.number
        };
        this.webSocketService.emit('video-chat-data',payload);
      }
    };
  }

  public async createOffer(){
    if (!this.connection) {
      await this.createPeerConnection();
    }
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);
    this.webSocketService.emit('video-chat-data', { type: 'offer', offer, contactNumber: this.contactDetails.number });
  }

  public async createAnswer(offer: any){
    if (!this.connection) {
      await this.createPeerConnection();
    }
    await this.connection.setRemoteDescription(offer);
    let answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);
    this.webSocketService.emit('video-chat-data', { type: 'answer', answer, contactNumber: this.contactDetails.number });
  }

  public async addAnswer(answer: any){
    if (this.connection) {
      if(!this.connection.currentRemoteDescription){
        this.connection.setRemoteDescription(answer)
      }
    }
  }

  getProfileImg(url: any){
    if(url){
      this.userService.getProfile(url).subscribe((response) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.remoteProfileImage = reader.result as string;
        };
        reader.readAsDataURL(response);
      });
    }
  }
  toggleAudio() {
    if (this.transmitStream) {
      this.transmitStream.getAudioTracks().forEach((track: { enabled: boolean; }) => {
        track.enabled = !track.enabled; // Toggle audio track
      });
    }
    this.audioEnable = !this.audioEnable
  }
  
  toggleVideo() {
    if (this.transmitStream) {
      this.transmitStream.getVideoTracks().forEach((track: { enabled: boolean; }) => {
        track.enabled = !track.enabled; // Toggle video track
      });
    }
    if(this.localStream){
      this.localStream.getVideoTracks().forEach((track: { enabled: boolean; }) => {
        track.enabled = !track.enabled; // Toggle video track
      });
    }
    this.videoEnable = !this.videoEnable
    const payload = {
      type: 'video-action',
      enable: this.videoEnable,
      contactNumber: this.contactDetails.number
    };
    this.webSocketService.emit('video-chat-data',payload);
  }
  cancelCall() {
    if (this.connection) {
      this.connection.close(); // Close the connection
    }
    this.stopTracking()
    this.router.navigate(['/index/chat-box'])
    const payload = {
      type: 'cancel',
      contactNumber: this.contactDetails.number
    };
    this.webSocketService.emit('video-chat-data',payload);
  }
  stopTracking(){
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop(); // Stop each track in the local stream
      });
      this.localStream = null; // Reset the local stream reference
    }
    this.localVideo.nativeElement.srcObject = null;
    if (this.transmitStream) {
      this.transmitStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop(); // Stop each track in the local stream
      });
      this.transmitStream = null; // Reset the local stream reference
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

