import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.development';
import { IState, initial_state } from '../types/state.types';
import { IUser } from '../types/user.types';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  $state = signal<IState>(initial_state);
  readonly #http = inject(HttpClient);

  constructor() {
    effect(() => {
      localStorage.setItem('record', JSON.stringify(this.$state()));
    });
  }

  signIn(credentials: { email: string, password: string; }) {
    return this.#http.post<{ success: boolean, data: string; }>(environment.BACKEND_SERVER_URL + '/users/signin', credentials);
  }

  signUp(credentials: IUser) {
    return this.#http.post<{ success: boolean, data: IUser; }>(environment.BACKEND_SERVER_URL + '/users/signup', credentials);
  }

  is_logged_in() {
    return this.$state()._id ? true : false;

  }
} 
