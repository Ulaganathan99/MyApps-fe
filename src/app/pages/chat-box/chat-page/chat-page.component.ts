import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {

  message!: string;
  message_list: any = [
    {content : 'message'},
    {content : 'message'},
    {content : 'message'},
    {content : 'message'},
    {content : 'message'},
    {content : 'message'},
    {content : 'message'},
    {content : 'message'},
    {content : 'message'},
    {content : 'message'},
    {content : 'message'},
     {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
      {content : 'message'},
    
  ]

  constructor() { }

  ngOnInit(): void {
  }

  sendMsg(){
    console.log(this.message);
    
  }
  

}
