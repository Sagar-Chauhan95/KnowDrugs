import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ReviewService } from './review.service';
import { IReview } from '../types/review.types';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  template: `
    <div class="container">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input
          type="text"
          formControlName="review"
          placeholder="Enter Review"
        /><br />
        <input
          type="number"
          formControlName="rating"
          placeholder="Enter rating from 1 - 10"
        />
        <br />
        <button type="submit" [disabled]="form.invalid">submit</button>
      </form>
    </div>
  `,
  styleUrl: './addReview.css',
})
export class AddReviewComponent {
  medicine_id = input<string>();
  readonly reviewService = inject(ReviewService);
  readonly #toastr = inject(ToastrService);
  readonly #router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    review: [ '', Validators.required ],
    rating: [ '', [ Validators.required, Validators.min(1), Validators.max(10) ] ],
  });

  get review() {
    return this.form.controls.review;
  }
  get rating() {
    return this.form.controls.rating;
  }

  submit() {
    this.reviewService
      .postReview(
        this.medicine_id()!,
        this.form.value as { review: string; rating: string; }
      )
      .subscribe((response) => {
        if (response.data) {
          this.#toastr.success('Review Successfully added');

          this.#router.navigate([
            '',
            'medicines',
            'details',
            this.medicine_id(),
            'reviews',
          ]);
        }
      });
  }
}
