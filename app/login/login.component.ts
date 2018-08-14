import { Component, OnInit, inject, Inject } from '@angular/core';
import {AuthService} from '../auth.service' ;
import {Router} from '@angular/router';
import {  LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {

    console.log('hiiiii');
    if ( this.storage.get('login')  === true) {
      this.auth.setLoggedIn(true);
      this.router.navigate(['/profile']);
    }
}

  ngOnInit() {
  }



  loginUser(event) {

    event.preventDefault();

    const target = event.target;
    const username = target.querySelector('#uname1').value ;
    const password = target.querySelector('#pwd1').value ;
    this.auth.getUserDetails(username, password)
              .subscribe(data => {

console.log(JSON.stringify(data));
                if ( data['login'] ) {
                  this.storage.set('login', true);
                  this.storage.set('fname', data['fname']);
                  this.storage.set('lname', data['lname']);
                  this.storage.set('email', data['email']);
                  this.storage.set('pwd', data['pwd']);
                  this.storage.set('id', data['id']);
                  this.router.navigate(['/profile']);
                } else {
                  window.alert('Invalid Username and password');
                }

              });
  }

}
