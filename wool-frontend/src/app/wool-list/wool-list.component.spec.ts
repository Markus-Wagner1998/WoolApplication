import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoolListComponent } from './wool-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

describe('WoolListComponent', () => {
  let component: WoolListComponent;
  let fixture: ComponentFixture<WoolListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppRoutingModule],
      declarations: [WoolListComponent, LoadingSpinnerComponent]
    });
    fixture = TestBed.createComponent(WoolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
