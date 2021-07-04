import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import messages from 'src/app/messages/messages';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';
import { JobStatus } from 'src/app/types/booking';
import { RolesEnum } from 'src/app/types/users';
import { getJobStatusInText } from 'src/app/utill/getJobStatusIntext';
@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  activeSegment: string = 'pending';
  pendingRequests: any = [];
  completedRequests: any = [];

  constructor(
    public util: UtilService,
    public fireStore: AngularFirestore,
    private dataService: DataService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('authenticatedUserRole') === RolesEnum.PROVIDER) {
      this.getProviderRequests();
    } else {
      this.getUserRequests();
    }
  }

  goToRequestDetails(request) {
    this.dataService.dataTransfer = request;
    this.util.navigateByURL('request-detail', 'forward');
  }

  getUserRequests() {
    this.util.startLoader();
    const uId = localStorage.getItem('authenticatedId');
    this.fireStore
      .collection('request', (ref) => ref.where('uId', '==', uId))
      .valueChanges()
      .subscribe(
        (res) => {
          if (res && res.length > 0) {
            res.forEach((element: any) => {
              this.fireStore
                .collection('users')
                .doc(element.providerId)
                .valueChanges()
                .subscribe((providerRes) => {
                  element.providerDetails = providerRes;
                });
            });
            this.pendingRequests = res.filter((r: any) => {
              return r.bookingStatus <= 2;
            });
            this.completedRequests = res.filter((r: any) => {
              return r.bookingStatus > 2;
            });
          }
          this.util.stopLoader();
        },
        (err) => {
          this.util.stopLoader();
          this.util.showErrorToast(
            messages.errorTitle,
            messages.somethingWentWrong
          );
          console.log('err: ', err);
        }
      );
  }

  getProviderRequests() {
    this.util.startLoader();
    const uId = localStorage.getItem('authenticatedId');
    this.fireStore
      .collection('request', (ref) => ref.where('providerId', '==', uId))
      .valueChanges()
      .subscribe(
        (res) => {
          if (res && res.length > 0) {
            res.forEach((element: any) => {
              this.fireStore
                .collection('users')
                .doc(element.providerId)
                .valueChanges()
                .subscribe((providerRes) => {
                  element.providerDetails = providerRes;
                });
            });
            this.pendingRequests = res.filter((r: any) => {
              return r.bookingStatus <= 2;
            });
            this.completedRequests = res.filter((r: any) => {
              return r.bookingStatus > 2;
            });
          }
          this.util.stopLoader();
        },
        (err) => {
          this.util.stopLoader();
          this.util.showErrorToast(
            messages.errorTitle,
            messages.somethingWentWrong
          );
          console.log('err: ', err);
        }
      );
  }

  getJobStatusText(jobStatus: JobStatus): string {
    return getJobStatusInText(jobStatus);
  }
}
