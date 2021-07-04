import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilService } from 'src/app/services/util.service';
import { toHTML } from 'ngx-editor';
@Component({
  selector: 'app-policy',
  templateUrl: './policy.page.html',
  styleUrls: ['./policy.page.scss'],
})
export class PolicyPage implements OnInit {
  policy: any;
  constructor(
    public util: UtilService,
    public fireStore: AngularFirestore
  ) { }

  ngOnInit() {
    this.getPolicy();
  }

  getPolicy() {
    this.util.startLoader();
    this.fireStore.collection('settings')
    .doc('policy')
    .valueChanges()
    .subscribe((resp: any) => {
      if (resp && resp.data) {
        const html = toHTML(resp.data); 
        this.policy = html;
      }
      this.util.stopLoader();
    });
  }

}
