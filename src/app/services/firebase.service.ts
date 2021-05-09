import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  downloadURL: Observable<string>;
  fb;
  constructor(
    public fireStore: AngularFirestore,
    public storage: AngularFireStorage
  ) { }

  addDataToCollection(endpoint, data) {
    const request = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log('request is here', request);
    return this.fireStore.collection(endpoint).add(request);
  }

  addDataToCollectionWithId(endpoint, data) {
    return this.fireStore.collection(endpoint).add(data);
  }

  getDataFromCollection(endpoint) {
    return this.fireStore.collection(endpoint).valueChanges();
  }

  uploadFile(uploadPath,event) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }
}

