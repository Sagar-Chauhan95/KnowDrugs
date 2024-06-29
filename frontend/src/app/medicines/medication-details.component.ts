import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../authentication/authentication.service';
import { IMedication } from '../types/medication.types';
import { MedicationService } from './medication.service';
import { ReviewService } from '../reviews/review.service';

@Component({
  selector: 'app-medication-details',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatSliderModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="container">
      <div class="firstSubcontainer">
        <div>
          <b>{{ medicationService.$medicine().name }} </b> <br />
          <b>Generic name: &nbsp;</b
          ><span>{{ medicationService.$medicine().generic_name }} </span> <br />
          <b>Drug Class: &nbsp;</b>
          <span> {{ medicationService.$medicine().medication_class }}</span>
        </div>

        @if(authService.is_logged_in() && authService.$state()._id ===
        medicationService.$medicine().added_by.user_id){
        <div class="updateButton">
          <button (click)="update(medicationService.$medicine()._id!)">
            update
          </button>
          <button (click)="delete(medicationService.$medicine()._id!)">
            delete
          </button>
        </div>
        }
      </div>
      <div class="secondSubContainer">
        <mat-card class="example-card">
          <mat-card-header>
            <mat-card-title>Drug Status</mat-card-title>
            <mat-card-actions>
              <mat-card-subtitle>
                <button mat-button>Availability</button>
                <button mat-button>
                  {{ medicationService.$medicine().availability }}
                </button>
              </mat-card-subtitle>
            </mat-card-actions>
          </mat-card-header>
          <br />
          Image
          <img
            mat-card-image
            src="{{ medicationService.$medicine().image?.originalname }}"
            alt="Image"
          />
          <mat-card-content>
            <p>Description</p>
          </mat-card-content>
          <mat-card-actions>
            <mat-card-content>
              <p>User Reviews & Ratings</p>
              <div class="progressBar">
                <b>{{ $average_rating() }}/10</b>
                <mat-progress-bar
                  mode="determinate"
                  [value]="$average_rating() * 10"
                ></mat-progress-bar>
              </div>
              <b>{{ medicationService.$medicine().reviews!.length }} </b
              ><button
                mat-button
                (click)="goToReview(medicationService.$medicine()._id!)"
              >
                Reviews
              </button>
              @if(authService.is_logged_in()){
              <p>
                <a
                  [routerLink]="[
                    '',
                    'medicines',
                    'details',
                    medicationService.$medicine()._id,
                    'reviews',
                    'add'
                  ]"
                  style="text-decoration: none;"
                  >Add Review</a
                >
              </p>
              }
            </mat-card-content>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styleUrl: './medicineDetail.css',
})
export class MedicationDetailsComponent {
  medicine_id = input.required<string>();
  readonly medicationService = inject(MedicationService);
  readonly #router = inject(Router);
  readonly #toastr = inject(ToastrService);
  readonly authService = inject(AuthenticationService);
  readonly reviewService = inject(ReviewService);
  $average_rating = signal<number>(0);

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  constructor() {
    effect(() => {
      this.medicationService.$medicine();
    });

    effect(() => {
      this.$average_rating();
    });
  }

  ngAfterViewInit(): void {
    this.medicationService
      .getMedicationById(this.medicine_id())
      .subscribe((response) => {
        if (response.success) {
          this.medicationService.$medicine.set(response.data);

          const reviews = [ ...this.medicationService.$medicine().reviews! ];
          if (reviews.length > 0) {
            const rating = reviews.reduce(
              (acc, review) => acc + Number(review.rating),
              0
            );

            this.$average_rating.set(Math.floor(rating / reviews.length));
          } else {
            this.$average_rating.set(Number(0));
          }
        }
      });
  }

  update(medicine_id: string) {
    this.#router.navigate([ '', 'medicines', 'update', medicine_id ]);
  }

  delete(medicine_id: string) {
    this.medicationService.deleteMedicationById(medicine_id).subscribe({
      next: (response) => {
        if (response.data) {
          this.medicationService.$medications.update((medications) =>
            medications.filter((med: IMedication) => med._id !== medicine_id)
          );
          this.#toastr.success('Medication successfully deleted');
          this.#router.navigate([ '', 'medicines_letters' ], {
            queryParams: {
              text: this.medicationService.$medicine().first_letter,
            },
          });
        }
      },

      error: (error) => {
        this.#toastr.error('Medication deletion Unsuccessfull');
      },
    });
  }

  goToReview(medicine_id: string) {
    this.#router.navigate([ '', 'medicines', 'details', medicine_id, 'reviews' ]);
  }
}
