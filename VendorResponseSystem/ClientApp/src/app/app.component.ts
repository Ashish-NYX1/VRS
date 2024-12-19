import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private router: Router) {    
  }
  title = 'app';
  sidebarToggle = false;

  handleToggle(data: boolean) {
    this.sidebarToggle = data;
  }

  get isLoginPage(): boolean {
    let pass = window.location.pathname === '/' || window.location.pathname.toLowerCase() === '/login';
    return pass;
  }
}
