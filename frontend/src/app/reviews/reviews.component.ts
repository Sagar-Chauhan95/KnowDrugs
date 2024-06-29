import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, NgStyle } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { MedicationService } from '../medicines/medication.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { ReviewService } from './review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    NgStyle,
    DatePipe,
    MatProgressBarModule,
  ],
  template: `
    <div class="container">
      @for(review of reviewService.$reviews(); track review._id; let e = $even){
      <mat-card
        class="example-card"
        [ngStyle]="{ 'background-color': e ? '#b4b4b4' : '' }"
      >
        <mat-card-header>
          <mat-card-title>
            {{ review.by.fullname }}... &nbsp; &nbsp; &nbsp;&nbsp;
            {{ review.date | date }}
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{ review.review }}</p>
          <div class="bar-style">
            <p>{{ review.rating }}/10</p>
            <mat-progress-bar
              class="bar"
              mode="determinate"
              [value]="review.rating * 10"
            ></mat-progress-bar>
          </div>
        </mat-card-content>
        @if(authService.is_logged_in() && authService.$state()._id ===
        review.by.user_id){
        <mat-card-actions>
          <button mat-button (click)="edit(review._id!)">edit</button>
          <button mat-button (click)="delete(review._id!)">delete</button>
        </mat-card-actions>

        }
      </mat-card>

      }
    </div>
  `,
  styleUrl: './reviews.css',
})
export class ReviewsComponent {
  medicine_id = input<string>();
  readonly reviewService = inject(ReviewService);
  readonly #toastr = inject(ToastrService);
  readonly medicationService = inject(MedicationService);
  readonly #router = inject(Router);
  authService = inject(AuthenticationService);

  constructor() {
    effect(() => {
      this.medicationService.$medications();
    });
  }

  ngAfterViewInit(): void {
    this.reviewService
      .getReviewByMedicationId(this.medicine_id()!)
      .subscribe((response) => {
        if (response.success) {
          this.reviewService.$reviews.set(response.data);
        }
      });
  }
  edit(reviewId: string) {
    this.#router.navigate([
      '',
      'medicines',
      'details',
      this.medicine_id(),
      'reviews',
      'update',
      reviewId,
    ]);
  }

  delete(review_id: string) {
    this.reviewService
      .deleteReviewById(this.medicine_id()!, review_id)
      .subscribe((response) => {
        if (response.data) {
          this.#toastr.success('Review successfully deleted');
          this.#router.navigate([
            '',
            'medicines',
            'details',
            this.medicine_id(),
          ]);
        }
      });
  }
}
