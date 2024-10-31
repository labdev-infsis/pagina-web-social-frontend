import { Injectable } from '@angular/core';
import { Role } from '../models/role';
import { UserDatastoreService } from './user-datastore.service';
import { ResetPassword } from '../models/reset-password';
import { EnableUser } from '../models/enable-user';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  public roles: Role[] = [];

  constructor(private userDatastoreService: UserDatastoreService) { }

  reserPassword(email: string, password: string){
    var resetPassword = new ResetPassword();
    resetPassword.email = email;
    resetPassword.password = password;

    return this.userDatastoreService.reserPassword(resetPassword);    
  }

  enableUser(email: string, isDisabled: boolean){
    var enableUser = new EnableUser();
    enableUser.email = email;
    enableUser.enable = isDisabled;
    
    return this.userDatastoreService.enableUser(enableUser);       
  } 
  
  public findById(id:number) {
    return this.userDatastoreService.findById(id);
  }

  public changePassword(user: User, credentials: any) {
    user.old_password = credentials.old_password;
    user.password = credentials.password;
    user.password_confirmation = credentials.password_confirmation;

    return this.userDatastoreService.changePassword(user);
  }
}
