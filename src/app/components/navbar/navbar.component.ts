import { Component } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  openModal() {
    const modal = new bootstrap.Modal(document.getElementById('userModal')!);
    modal.show();
  }
}
