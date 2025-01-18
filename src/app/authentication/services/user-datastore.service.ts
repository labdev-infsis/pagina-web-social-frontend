import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { ResetPassword } from '../models/reset-password';
import { EnableUser } from '../models/enable-user';

@Injectable({
  providedIn: 'root'
})
export class UserDatastoreService {
  private readonly ROOT_URL = `${environment.BACK_END_HOST_DEV}/users`;

  constructor(private http: HttpClient) { }

  reserPassword(resetPassword: ResetPassword){
    return this.http.post<ResetPassword>(this.ROOT_URL + '/resetpassword', resetPassword);
  }

  enableUser(enableUser: EnableUser){
    return this.http.post<ResetPassword>(this.ROOT_URL + '/enableuser', enableUser);
  }

  findById(id:number) {
    return this.http.get<User>(this.ROOT_URL + '/' + id);
  }

  changePassword(user: User) {
    return this.http.post<any>(environment.BACK_END_HOST_DEV + 'users/changepassword', user);
  }
}
