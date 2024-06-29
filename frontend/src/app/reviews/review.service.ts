import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { IReview } from '../types/review.types';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  readonly #http = inject(HttpClient);
  $reviews = signal<IReview[]>([]);

  constructor() {
    effect(() => {
      this.$reviews();
    });
  }

  getReviewByMedicationId(medicationId: string) {
    return this.#http.get<{ success: boolean; data: IReview[]; }>(
      environment.BACKEND_SERVER_URL +
      '/medications/' +
      medicationId +
      '/reviews'
    );
  }

  getReviewByMedicationIdAndReviewId(medicationId: string, reviewId: string) {
    return this.#http.get<{ success: boolean; data: IReview; }>(
      environment.BACKEND_SERVER_URL +
      '/medications/' +
      medicationId +
      '/reviews/' +
      reviewId
    );
  }

  postReview(
    medicationId: string,
    newReview: { review: string; rating: string; }
  ) {
    return this.#http.post<{ success: boolean; data: string; }>(
      environment.BACKEND_SERVER_URL +
      '/medications/' +
      medicationId +
      '/reviews',
      newReview
    );
  }

  updateReviewById(
    medicationId: string,
    reviewId: string,
    updatedReview: { review: string; rating: number; }
  ) {
    return this.#http.put<{ success: boolean; data: boolean; }>(
      environment.BACKEND_SERVER_URL +
      '/medications/' +
      medicationId +
      '/reviews/' +
      reviewId,
      updatedReview
    );
  }

  deleteReviewById(medicationId: string, reviewId: string) {
    return this.#http.delete<{ success: boolean; data: boolean; }>(
      environment.BACKEND_SERVER_URL +
      '/medications/' +
      medicationId +
      '/reviews/' +
      reviewId
    );
  }
}
