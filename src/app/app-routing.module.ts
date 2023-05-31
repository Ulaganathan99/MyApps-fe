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
import { ChatBoxHistoryComponent } from './pages/chat-box/chat-box-history/chat-box-history.component';
import { ChatBoxInviteComponent } from './pages/chat-box/chat-box-invite/chat-box-invite.component';
import { ChatPageComponent } from './pages/chat-box/chat-page/chat-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', pathMatch: 'full', component: LoginComponent },
      { path: 'signup', pathMatch: 'full', component: SignupComponent },
      { path: 'signup-otp', component: SignupOtpVerificationComponent },
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
              { path: 'chat-box-history', component: ChatBoxHistoryComponent },
              { path: 'chat-box-invite', component: ChatBoxInviteComponent },
              { path: 'chat-page', component: ChatPageComponent },
            ],
          }
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
