import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { SharedDataService } from 'src/services/shared-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  @ViewChild('empvideo') empvideo!: ElementRef;

  ngOnInit() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
      this.router.navigate(['/Dashboard']);
    }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private sharedService: SharedDataService) {
   
  }
   


  onSubmit() {
    if (this.loginForm && this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;      
      this.authService.login(username, password).subscribe(
        {
          next: (r) => {
           if(r!= null && r.userName != null){
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('displayName',r.displayName);         
            sessionStorage.setItem('username',username);
            sessionStorage.setItem('description', r.description);
            sessionStorage.setItem('email',username+'@nyxinc.com')
            this.sharedService.setSharedDisplayName(r.displayName);
             this.router.navigate(['/Dashboard']);
           }
           else{
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('displayName');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('description');
            sessionStorage.removeItem('email');
           }
          },
          error: (error) => {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('displayName');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('description');
            sessionStorage.removeItem('email');
          }
        }       
      );      

    }
  }
}
