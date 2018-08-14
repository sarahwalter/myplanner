import { Component, OnInit, Inject } from '@angular/core';
import {  LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import {AuthService} from '../auth.service' ;
import {Router} from '@angular/router';


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

   records = {};

  constructor(private auth: AuthService, private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {


    this.auth.getjobs().subscribe ( data => {

      this. records = data;
      console.log(JSON.stringify(data));
    });

  }
  logout() {

    this.storage.set('login', false);
    setTimeout(0.1);
    this.router.navigate(['/login']);
    }

    profile() {

      this.router.navigate(['/profile']);
    }

    deleten(id) {

      console.log(id);
      if (window.confirm('Do you realy want to delete this job ?')) {
        this.auth.deletejob(id)
               .subscribe(data => {

                if ( data['del'] ) {
                      window.alert('Job deleted');
                      this.loadjobagain();
                 } else {
                  window.alert('Intenal Server Error');
                  this.loadjobagain();
                 }
                });
      }

    }

  upjob(event) {

    event.preventDefault();
    const target = event.target;
    const title = target.querySelector('#up-job-title').value ;
    const payrate = target.querySelector('#up-pay-rate').value ;
    const jobid = target.querySelector('#up-job-id').value ;

    this.auth.updatesinglejob(title, payrate, jobid)
              .subscribe(data => {
                if (data['done'] === true) {

                  window.alert('Job updated successfully!!');
                  this.loadjobagain();

                } else {
                  window.alert('Error while updating the Job');
                  this.loadjobagain();
                }
              });

  }


    addjobs(event) {
      event.preventDefault();

      const target = event.target;
      const title = target.querySelector('#add-job-title').value ;
      const payrate = target.querySelector('#add-pay-rate').value ;
      this.auth.addjobservice(title, payrate)
                .subscribe(data => {
                  if (data['done'] === true) {

                    window.alert('New Job Added');
                    this.loadjobagain();

                  } else {
                    window.alert('Error While adding New Job');
                    this.loadjobagain();
                  }
                });

    }

    loadjobagain() {
     // this.router.navigate(['/jobs']);
     window.location.reload();
    }

  ngOnInit() {
  }

}
