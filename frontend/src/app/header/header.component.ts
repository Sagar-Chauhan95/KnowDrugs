import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { initial_state } from '../types/state.types';
import { MedicationService } from '../medicines/medication.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ RouterLink, NgClass, ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  authService = inject(AuthenticationService);
  medicationService = inject(MedicationService);
  letterGroup = "abcdefghijklmnopqrstuvwxyz";
  letters = this.letterGroup.toUpperCase().split("");

  logout() {

    this.authService.$state.set(initial_state);
    localStorage.clear();

  }
  showMedicine(letter: string) {
    this.medicationService.getMedicationsByFirstLetter(letter).subscribe(response => {
      this.medicationService.$medications.set(response.data);
    });

  }


}

