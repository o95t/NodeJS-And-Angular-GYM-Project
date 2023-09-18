import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { parse } from 'flatted';

import { addTokenInterceptor } from './add-token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOKEN_KEY, USER_KEY } from './constants/keys';
import { AuthService } from './services/auth.service';
import { SignInComponent } from './sign-in.component';
import { SignUpComponent } from './sign-up.component';
import { UIModule } from './ui/ui.module';

const bootstrap = (authService: AuthService) => {
  return () => {
    const token =
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const user =
      localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (token) {
      authService.token.set(token);
      authService.user.set(parse(user!));
      authService.getFriends().subscribe((res) => {
        if (res.success) {
          authService.friends.set(res.data);
        }
      });
      authService.getRequests().subscribe((res) => {
        if (res.success) {
          authService.requests.set(res.data);
        }
      });
      authService.getSentRequests().subscribe((res) => {
        if (res.success) {
          authService.sentRequests.set(res.data);
        }
      });
    }
  };
};

@NgModule({
  declarations: [AppComponent, SignInComponent, SignUpComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UIModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: bootstrap,
      deps: [AuthService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
