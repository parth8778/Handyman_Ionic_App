import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  activeSegment: string = 'pending';
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }
}
