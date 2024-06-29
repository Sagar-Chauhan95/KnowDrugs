import { Component, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../authentication/authentication.service';
import { MedicationService } from './medication.service';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [ MatTabsModule, RouterLink ],
  template: `
    <mat-tab-group animationDuration="0ms">
      <mat-tab label="Browse Drugs">
        <div>
          @for(letter of letters; track letter){

          <button
            [routerLink]="['', 'medicines_letters']"
            [queryParams]="{ text: letter }"
            (click)="showMedicine(letter)"
          >
            {{ letter }}
          </button>
          }
        </div>

        <div style="margin-top: 20px;">
          @for(medication of medicationService.$medications(); track
          medication._id){
          <a
            [routerLink]="['', 'medicines', 'details', medication._id]"
            (click)="hide()"
            >{{ medication.name }}
          </a>
          <br />

          }
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styleUrl: './medicineHome.css',
})
export class MedicinesComponent {
  authService = inject(AuthenticationService);
  medicationService = inject(MedicationService);
  letterGroup = 'abcdefghijklmnopqrstuvwxyz';
  letters = this.letterGroup.toUpperCase().split('');
  readonly #toastr = inject(ToastrService);

  showMedicine(letter: string) {
    this.medicationService.$show.set(true);
    this.medicationService
      .getMedicationsByFirstLetter(letter)
      .subscribe((response) => {
        if (response.data.length) {
          this.medicationService.$medications.set(response.data);
        } else {
          this.#toastr.error('Medication List is Empty');
        }
      });
  }

  constructor() {
    let letter = 'A';
    this.medicationService
      .getMedicationsByFirstLetter(letter)
      .subscribe((response) => {
        if (response.success) {
          this.medicationService.$medications.set(response.data);
        }
      });
  }

  hide() {
    this.medicationService.$show.set(true);
  }
}
