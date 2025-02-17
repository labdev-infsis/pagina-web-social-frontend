import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pagina-web-social-frontend';
  constructor() {
    // console.log("Token en localStorage:", localStorage.getItem('token'));
  }
}
