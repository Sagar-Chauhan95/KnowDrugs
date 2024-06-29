import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from './review.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-review',
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
          placeholder="Enter rating from 0 - 10"
        />
        <br />
        <button type="submit" [disabled]="form.invalid">submit</button>
      </form>
    </div>
  `,
  styleUrl: './addReview.css',
})
export class UpdateReviewComponent {
  medicine_id = input<string>();
  review_id = input<string>();
  readonly reviewService = inject(ReviewService);
  readonly #toastr = inject(ToastrService);
  readonly #router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    review: [ '', Validators.required ],
    rating: [ 0, [ Validators.required, Validators.min(1), Validators.max(10) ] ],
  });

  get review() {
    return this.form.controls.review;
  }
  get rating() {
    return this.form.controls.rating;
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.reviewService
      .getReviewByMedicationIdAndReviewId(
        this.medicine_id()!,
        this.review_id()!
      )
      .subscribe((response) => {
        if (response.success) {
          this.review.patchValue(response.data.review);
          this.rating.patchValue(response.data.rating);
        }
      });
  }

  submit() {
    this.reviewService
      .updateReviewById(
        this.medicine_id()!,
        this.review_id()!,
        this.form.value as { review: string; rating: number; }
      )
      .subscribe((response) => {
        if (response.success) {
          this.#toastr.success('Review successfully Updated');
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
