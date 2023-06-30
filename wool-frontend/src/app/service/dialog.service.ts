import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, ComponentRef, EmbeddedViewRef } from '@angular/core';
import { InfoboxComponent } from '../infobox/infobox.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  dialogComponentRef?: ComponentRef<InfoboxComponent>;
  private dialogElement?: HTMLElement;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  openDialog(options: { type: 'info' | 'warn' | 'error', headline: string, text: string}): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(InfoboxComponent);
    this.dialogComponentRef = componentFactory.create(this.injector);
    this.dialogComponentRef.instance.headline = options.headline;
    this.dialogComponentRef.instance.text = options.text;
    this.dialogComponentRef.instance.type = options.type;

    this.dialogComponentRef.changeDetectorRef.detectChanges();

    this.dialogElement = (this.dialogComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(this.dialogElement);
  }

  closeDialog(): void {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      if (this.dialogElement) {
        document.body.removeChild(this.dialogElement);
      }
    }
  }
}
