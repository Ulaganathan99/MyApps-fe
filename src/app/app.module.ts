import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';



import { AppComponent } from './app.component';
import { LoginComponent } from './pages/user/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LayoutComponent } from './layout/layout.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { IndexComponent } from './pages/index/index.component';
import { SignupComponent } from './pages/user/signup/signup.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { UserService } from './services/user.service';
import { SignupOtpVerificationComponent } from './pages/user/signup-otp-verification/signup-otp-verification.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { HomeComponent } from './pages/home/home.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { SliderInputComponent } from './components/slider-input/slider-input.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { ContactBookSummaryComponent } from './pages/contact-book/contact-book-summary/contact-book-summary.component';
import { ProfileEditComponent } from './pages/profile/profile-edit/profile-edit.component';
import { SessionInterceptor } from './services/session.interceptor';
import { LocalStorageService } from './services/local-storage.service';
import { AuthGuard } from './services/auth.guard';
import { ContactAddContactComponent } from './pages/contact-book/contact-add-contact/contact-add-contact.component';
import { ContactListComponent } from './pages/contact-book/contact-list/contact-list.component';
import { ContactEditComponent } from './pages/contact-book/contact-edit/contact-edit.component';
import { ContactDeleteComponent } from './pages/contact-book/contact-delete/contact-delete.component';
import { TabComponent } from './components/tab/tab.component';
import { SearchComponent } from './components/search/search.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { PhoneNumberPipe } from './pipes/phone-number.pipe';
import { ChatBoxSummaryComponent } from './pages/chat-box/chat-box-summary/chat-box-summary.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ChatBoxChatsComponent } from './pages/chat-box/chat-box-chats/chat-box-chats.component';
import { ChatBoxInviteComponent } from './pages/chat-box/chat-box-invite/chat-box-invite.component';
import { ChatPageComponent } from './pages/chat-box/chat-page/chat-page.component';
import { ProfileDeletePopupComponent } from './pages/profile/profile-delete-popup/profile-delete-popup.component';
import { IndianTimePipe } from './pipes/indian-time.pipe';
import { ChatBoxAllChatsComponent } from './pages/chat-box/chat-box-all-chats/chat-box-all-chats.component';
import { TablePaginationComponent } from './components/table-pagination/table-pagination.component';
import { ForgotComponent } from './pages/user/forgot/forgot.component';
import { ForgotOtpComponent } from './pages/user/forgot-otp/forgot-otp.component';
import { ForgotPassComponent } from './pages/user/forgot-pass/forgot-pass.component';
import { ChatBoxVideoChatComponent } from './pages/chat-box/chat-box-video-chat/chat-box-video-chat.component';
import { NoRightClickDirective } from './directives/no-right-click.directive';
import { VideosListComponent } from './pages/video-streaming/videos-list/videos-list.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    LoaderComponent,
    LayoutComponent,
    LandingPageComponent,
    IndexComponent,
    SignupComponent,
    SignupOtpVerificationComponent,
    SideNavComponent,
    HomeComponent,
    DropdownComponent,
    SliderInputComponent,
    ProfileComponent,
    TopMenuComponent,
    ContactBookSummaryComponent,
    ProfileEditComponent,
    ContactAddContactComponent,
    ContactListComponent,
    ContactEditComponent,
    ContactDeleteComponent,
    TabComponent,
    SearchComponent,
    CheckboxComponent,
    PhoneNumberPipe,
    ChatBoxSummaryComponent,
    TabsComponent,
    ChatBoxChatsComponent,
    ChatBoxInviteComponent,
    ChatPageComponent,
    ProfileDeletePopupComponent,
    IndianTimePipe,
    ChatBoxAllChatsComponent,
    TablePaginationComponent,
    ForgotComponent,
    ForgotOtpComponent,
    ForgotPassComponent,
    ChatBoxVideoChatComponent,
    NoRightClickDirective,
    VideosListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    MatTooltipModule,
    ScrollingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSnackBarModule
    


  ],
  providers: [
    HttpClientModule,
    LocalStorageService,
    AuthGuard,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
