import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Wool } from '../data/Wool';

@Component({
  selector: 'app-wool-list',
  templateUrl: './wool-list.component.html',
  styleUrls: ['./wool-list.component.css']
})
export class WoolListComponent implements OnInit{
  wools: Wool[] = [];

  constructor(private readonly http: HttpClient) {
  }

  ngOnInit(): void {
    this.http
      .get<Wool[]>('http://192.168.178.99:8080/inventory')
        .subscribe((data: Wool[]) => {
          console.log(data);
          this.wools = data
        });
  }

}
