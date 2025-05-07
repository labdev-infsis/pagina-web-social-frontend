import { Component, Input, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-popup-info-user',
  templateUrl: './popup-info-user.component.html',
  styleUrl: './popup-info-user.component.scss'
})
export class PopupInfoUserComponent {
  @ViewChild('op') overlayPanel!: OverlayPanel;
  @Input() public urlImage: string = '';
  @Input() public alternativeText: string = '';
  @Input() public nameUser: string = '';
  @Input() public email: string = '';
  @Input() public closeIcon: boolean = false;

  toggle(event: Event): void {
    this.overlayPanel.toggle(event);
  }

}
