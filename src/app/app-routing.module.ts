import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/user/login/login.component';
import { IndexComponent } from './pages/index/index.component';
import { SignupComponent } from './pages/user/signup/signup.component';
import { SignupOtpVerificationComponent } from './pages/user/signup-otp-verification/signup-otp-verification.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ContactBookSummaryComponent } from './pages/contact-book/contact-book-summary/contact-book-summary.component';
import { ProfileEditComponent } from './pages/profile/profile-edit/profile-edit.component';
import { AuthGuard } from './services/auth.guard';
import { ContactAddContactComponent } from './pages/contact-book/contact-add-contact/contact-add-contact.component';
import { ContactListComponent } from './pages/contact-book/contact-list/contact-list.component';
import { ChatBoxSummaryComponent } from './pages/chat-box/chat-box-summary/chat-box-summary.component';
import { ChatBoxChatsComponent } from './pages/chat-box/chat-box-chats/chat-box-chats.component';
import { ChatBoxInviteComponent } from './pages/chat-box/chat-box-invite/chat-box-invite.component';
import { ChatPageComponent } from './pages/chat-box/chat-page/chat-page.component';
import { ChatBoxAllChatsComponent } from './pages/chat-box/chat-box-all-chats/chat-box-all-chats.component';
import { ForgotComponent } from './pages/user/forgot/forgot.component';
import { ForgotOtpComponent } from './pages/user/forgot-otp/forgot-otp.component';
import { ForgotPassComponent } from './pages/user/forgot-pass/forgot-pass.component';
import { ChatBoxVideoChatComponent } from './pages/chat-box/chat-box-video-chat/chat-box-video-chat.component';
import { VideosListComponent } from './pages/video-streaming/videos-list/videos-list.component';
import { VideoSummaryComponent } from './pages/video-streaming/video-summary/video-summary.component';
import { VideoScreenComponent } from './pages/video-streaming/video-screen/video-screen.component';
import { VideoUploadComponent } from './pages/video-streaming/video-upload/video-upload.component';
import { MyVideoComponent } from './pages/video-streaming/my-video/my-video.component';
import { DriveSummaryComponent } from './pages/drive/drive-summary/drive-summary.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', pathMatch: 'full', component: LoginComponent },
      { path: 'signup', pathMatch: 'full', component: SignupComponent },
      { path: 'signup-otp', component: SignupOtpVerificationComponent },
      { path: 'forgot', component: ForgotComponent },
      { path: 'forgot-otp', component: ForgotOtpComponent },
      { path: 'forgot-pass', component: ForgotPassComponent },
      {
        path: 'index',
        component: IndexComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
          { path: 'home', component: HomeComponent },
          { path: 'profile', component: ProfileComponent },
          { path: 'profile-edit', component: ProfileEditComponent },
          {
            path: 'contact-book',
            component: ContactBookSummaryComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'contact-list' },
              { path: 'contact-list', component: ContactListComponent },
              { path: 'add-contact', component: ContactAddContactComponent },
            ],
          },
          {
            path: 'chat-box',
            component: ChatBoxSummaryComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'chat-box-chats' },
              { path: 'chat-box-chats', component: ChatBoxChatsComponent },
              { path: 'chat-box-all-chat', component: ChatBoxAllChatsComponent },
              { path: 'chat-box-invite', component: ChatBoxInviteComponent },
              { path: 'chat-page', component: ChatPageComponent },
              { path: 'video-chat', component: ChatBoxVideoChatComponent },
            ],
          },
          {
            path: 'video-streaming',
            component: VideoSummaryComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'video-list' },
              { path: 'video-list', component: VideosListComponent },
              { path: 'video-screen', component: VideoScreenComponent },
              { path: 'video-upload', component: VideoUploadComponent },
              { path: 'my-video', component: MyVideoComponent },
            ],
            
          },
          {
            path: 'drive',
            component: DriveSummaryComponent,
            // children: [
            //   { path: '', pathMatch: 'full', redirectTo: 'video-list' },
            //   { path: 'video-list', component: VideosListComponent },
            //   { path: 'video-screen', component: VideoScreenComponent },
            //   { path: 'video-upload', component: VideoUploadComponent },
            //   { path: 'my-video', component: MyVideoComponent },
            // ],
          }
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
     useHash: true,
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
