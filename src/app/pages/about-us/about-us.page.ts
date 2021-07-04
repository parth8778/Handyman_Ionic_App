import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilService } from 'src/app/services/util.service';
import { toHTML } from 'ngx-editor';
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  about: any;
  constructor(
    public util: UtilService,
    public fireStore: AngularFirestore
  ) { }

  ngOnInit() {
    this.getAbout();
  }

  getAbout() {
    this.util.startLoader();
    this.fireStore.collection('settings')
    .doc('aboutUs')
    .valueChanges()
    .subscribe((resp: any) => {
      if (resp && resp.data) {
        const html = toHTML(resp.data); 
        this.about = html;
      }
      this.util.stopLoader();
    });
  }

}
