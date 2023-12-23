import { ElementRef, Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class CallService {
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
  contactNumber: any;

  connection!: RTCPeerConnection;

  constructor(private socketService: WebSocketService) {}

  private async _initConnection(remoteVideo: ElementRef): Promise<void> {
    this.connection = new RTCPeerConnection(this.configuration);
    console.log('getstreams call from initconnection');
    await this._getStreams(remoteVideo);
    console.log('registerconnection call from initconnection');
    
    this._registerConnectionListeners();
  }

  public async makeCall(remoteVideo: ElementRef): Promise<void> {
    console.log('initconnection call from makecall');
    
    await this._initConnection(remoteVideo);

   
    setTimeout(async () => {
      console.log('affer timer');
      console.log('createoffer call from makecall');
      const offer = await this.connection.createOffer();
    console.log('setlocal description from makecall');

    await this.connection.setLocalDescription(offer);

    this.socketService.emit('video-chat-data',{ type: 'offer', offer, contactNumber: this.contactNumber });
    }, 5000);
    
  }

  public async handleOffer(
    offer: RTCSessionDescription,
    remoteVideo: ElementRef,
    contactNumber: any
  ): Promise<void> {
    this.contactNumber = contactNumber
    await this._initConnection(remoteVideo);

    await this.connection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await this.connection.createAnswer();

    await this.connection.setLocalDescription(answer);

    this.socketService.emit('video-chat-data',{ type: 'answer', answer , contactNumber: this.contactNumber});
    // this.socketService.sendMessage({ type: 'answer', answer });
  }

  public async handleAnswer(answer: RTCSessionDescription, contactNumber: any): Promise<void> {
    this.contactNumber = contactNumber
    await this.connection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  public async handleCandidate(candidate: RTCIceCandidate, contactNumber: any): Promise<void> {
    this.contactNumber = contactNumber
    if (candidate) {
      await this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private _registerConnectionListeners(): void {
    this.connection.onicegatheringstatechange = (ev: Event) => {
      console.log(
        `ICE gathering state changed: ${this.connection.iceGatheringState}`
      );
    };

    this.connection.onconnectionstatechange = () => {
      console.log(
        `Connection state change: ${this.connection.connectionState}`
      );
    };

    this.connection.onsignalingstatechange = () => {
      console.log(`Signaling state change: ${this.connection.signalingState}`);
    };

    this.connection.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state change: ${this.connection.iceConnectionState}`
      );
    };
    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        const payload = {
          type: 'candidate',
          candidate: event.candidate.toJSON(),
          contactNumber: this.contactNumber
        };
        this.socketService.emit('video-chat-data',payload);
        // this.signalingService.sendMessage(payload);
      }
    };
    console.log('registerconnection done');
  }

  private async _getStreams(remoteVideo: ElementRef): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    const remoteStream = new MediaStream();

    remoteVideo.nativeElement.srcObject = remoteStream;

    this.connection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    stream.getTracks().forEach((track) => {
      this.connection.addTrack(track, stream);
    });
    console.log('getstreams done');

  }
}