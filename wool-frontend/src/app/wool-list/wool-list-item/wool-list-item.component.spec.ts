import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoolListItemComponent } from './wool-list-item.component';
import { HttpClientModule } from '@angular/common/http';

describe('WoolListItemComponent', () => {
  let component: WoolListItemComponent;
  let fixture: ComponentFixture<WoolListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [WoolListItemComponent]
    });
    fixture = TestBed.createComponent(WoolListItemComponent);
    component = fixture.componentInstance;
    component.wool = {
      id: 1,
      name: 'wool',
      color: 'black',
      brand: 'brand',
      intensity: 1,
      initialAmount: 1,
      remainingAmount: 1,
      singleAmount: 1,
      images: [],
      tags: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
