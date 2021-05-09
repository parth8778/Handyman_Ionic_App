import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.page.html',
  styleUrls: ['./provider-detail.page.scss'],
})
export class ProviderDetailPage implements OnInit {
  activeSegment: string = 'about';
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  segmentChanged(event) {
    if(event && event.target && event.target.value) {
      this.activeSegment = event.target.value;
    }
  }
}
