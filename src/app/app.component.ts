import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './authentication/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig, private authService: AuthService) {}

  ngOnInit(): void{
    this.primengConfig.ripple = true;
    setInterval(() => {
      this.authService.checkTokenExpiration();
    }, 60000);

     this.authService.checkTokenExpiration();
  }
}
