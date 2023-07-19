import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoolListItemComponent } from './wool-list-item.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DialogService } from 'src/app/service/dialog.service';
import { Subject, of } from 'rxjs';
import { Router } from '@angular/router';

describe('WoolListItemComponent', () => {
  let component: WoolListItemComponent;
  let fixture: ComponentFixture<WoolListItemComponent>;
  let navigateSpy: jasmine.Spy;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [WoolListItemComponent],
      providers: [ 
        {
          provide: DialogService,
          useValue: {
            openDialog: () => {},
            closeDialog: () => {},
            dialogComponentRef: {
              instance: {
                onNoClick: new Subject(),
                onYesClick: new Subject(),
              },
            },
          }
        }
      ]
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
    const router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.stub();
    http = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expanded', () => {
    component.toggleExpanded();
    expect(component.expanded).toBeTrue();
  });

  it('should get empty string for no image', () => {
    expect(component.getWoolImage()).toEqual('');
  });
  
  it('should get image', () => {
    component.wool.images = [
      {
        id: 1,
        imageBase64: 'imageBase64',
      }
    ]
    expect(component.getWoolImage()).toEqual('imageBase64');
  });

  it('should delete wool', () => {
    let stopPropagationCalled = false;
    const event = {
      stopPropagation: () => {stopPropagationCalled = true},
    } as Event;

    component.deleteWool(event);

    expect(stopPropagationCalled).toBeTrue();
  });
  
  it('should delete wool, yesclick', () => {
    component.wool.id = 13;
    let stopPropagationCalled = false;
    let elementDeletedEmitted = false;
    const event = {
      stopPropagation: () => {stopPropagationCalled = true},
    } as Event;
    const deleteSpy = spyOn(http, 'delete').and.returnValue(of('anything'))
    const dialogService = TestBed.inject(DialogService);
    component.elementDeletedEmitter.subscribe(() => elementDeletedEmitted = true);

    component.deleteWool(event);
    dialogService.dialogComponentRef?.instance.onYesClick.next();

    expect(stopPropagationCalled).toBeTrue();
    expect(deleteSpy).toHaveBeenCalledWith('/api/inventory/13');
    expect(elementDeletedEmitted).toBeTrue();
  });
  
  it('should delete wool, noclick', () => {
    component.wool.id = 13;
    let stopPropagationCalled = false;
    let elementDeletedEmitted = false;
    const event = {
      stopPropagation: () => {stopPropagationCalled = true},
    } as Event;
    const deleteSpy = spyOn(http, 'delete').and.returnValue(of('anything'))
    const dialogService = TestBed.inject(DialogService);
    component.elementDeletedEmitter.subscribe(() => elementDeletedEmitted = true);

    component.deleteWool(event);
    dialogService.dialogComponentRef?.instance.onNoClick.next();

    expect(stopPropagationCalled).toBeTrue();
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(elementDeletedEmitted).toBeFalse();
  });
  
  it('should edit wool', () => {
    component.wool.id = 12;
    let stopPropagationCalled = false;
    const event = {
      stopPropagation: () => {stopPropagationCalled = true},
    } as Event;

    component.editWool(event);

    expect(stopPropagationCalled).toBeTrue();
    expect(navigateSpy).toHaveBeenCalledWith(['add'], {
      queryParams: {
        inventoryId: 12,
      },
      queryParamsHandling: 'merge',
    });
  });
  
});
