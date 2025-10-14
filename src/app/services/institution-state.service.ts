import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Institution } from '../posts/models/institution';

@Injectable({
  providedIn: 'root'
})
export class InstitutionStateService {
  private institutionSubject = new BehaviorSubject<Institution | null>(null);

  public readonly currentInstitution$ = this.institutionSubject.asObservable();

  setInstitution(institution: Institution | null): void {
    this.institutionSubject.next(institution);
  }

  clearUser(): void {
    this.institutionSubject.next(null);
  }
}