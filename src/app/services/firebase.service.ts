import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize, map } from "rxjs/operators";
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
    const { docId, ...rest } = data;
    const request = {
      ...rest,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.fireStore.collection(endpoint).doc(docId).set(request);
  }

  addOrUpdateCollection(collection, data, docId) {
    const request = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.fireStore.collection(collection).doc(docId).set(request);
  }

  getCollectionWithId(ref) {
   return this.fireStore.collection(ref).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data: any = a.payload.doc.data();
        const id: any = a.payload.doc.id;
        return { id, ...data };
      }))
    )
  }

  addDataToCollectionWithId(endpoint, data) {
    return this.fireStore.collection(endpoint).add(data);
  }

  getDataFromCollection(endpoint) {
    return this.fireStore.collection(endpoint).valueChanges();
  }

  removeDataFromCollection(endpoint, docId) {
    return this.fireStore.collection(endpoint).doc(docId).delete();
  }

  getCollectionWithDocId(endpoint, docId) {
    return this.fireStore.collection(endpoint).doc(docId).valueChanges();
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

