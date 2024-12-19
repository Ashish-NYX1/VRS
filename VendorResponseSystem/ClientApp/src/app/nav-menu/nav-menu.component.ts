import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/models/user-model';
import { AuthService } from 'src/services/auth.service';
import { SharedDataService } from 'src/services/shared-data.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  canHandleTeam = false;
  teamDetails: UserModel[] = [];
  canSeeReports = false;
  toggleSideMenu = false;
  userImage : any;
  @Output() doToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router, private sharedService: SharedDataService, private auth: AuthService) {}
  ngOnInit(): void {
   
  }

  sideBarToggle() {
    this.toggleSideMenu = !this.toggleSideMenu;
    this.doToggle.emit(this.toggleSideMenu);
  }


  
  get isLoginPage(): boolean{
    let pass = window.location.pathname === '/' || window.location.pathname.toLowerCase() === '/login';
    return pass;
  }

  get displayName(): string{
    let displayName = sessionStorage.getItem('displayName');
    return displayName == null?"":displayName;
  }

  get description(): string{
    let description = sessionStorage.getItem('description');
    return description == null?"":description;
  }

  get isLoggedIn(): boolean{
    let isLoggedIn = sessionStorage.getItem('isLoggedIn');
    return isLoggedIn != null;
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout(){
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('displayName');
    sessionStorage.removeItem('teamName');
    sessionStorage.removeItem('team');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('description');
    sessionStorage.removeItem('email');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
