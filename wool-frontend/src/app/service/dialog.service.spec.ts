import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { CommonModule } from '@angular/common';
import { InfoboxComponent } from '../infobox/infobox.component';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoboxComponent],
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog', () => {
    service.openDialog(
      { 
        type: 'info', 
        headline: 'head', 
        text: 'content',
      }
    );
    expect(service.dialogComponentRef).toBeTruthy();
    expect(service.dialogComponentRef?.instance.type).toEqual('info');
    expect(service.dialogComponentRef?.instance.headline).toEqual('head');
    expect(service.dialogComponentRef?.instance.text).toEqual('content');
  });

  it('should fail to close dialog', () => {
    const removeElementSpy = spyOn(document.body, 'removeChild')
    service.closeDialog();
    expect(removeElementSpy).not.toHaveBeenCalled();
  });

  it('should close dialog', () => {
    service.openDialog(
      { 
        type: 'info', 
        headline: 'head', 
        text: 'content',
      }
    );
    const removeElementSpy = spyOn(document.body, 'removeChild')
    service.closeDialog();
    expect(removeElementSpy).toHaveBeenCalled();
  });

});
