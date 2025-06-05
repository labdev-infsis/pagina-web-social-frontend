import { Component, OnInit } from '@angular/core';
import { UserDetail } from '../../../posts/models/user-detail';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public currentUser!: UserDetail

  constructor(
    private readonly userService: UserService
  ){}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (user: UserDetail) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.log('Error al obtener datos del usuario', error);
      }
    });
  }
}
