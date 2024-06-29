import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IMedication } from '../types/medication.types';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  readonly #http = inject(HttpClient);
  $medications = signal<IMedication[]>([]);

  $show = signal<boolean>(false);
  $medicine = signal<IMedication>({
    name: '',
    generic_name: '',
    medication_class: '',
    availability: '',
    added_by: {
      user_id: '',
      fullname: '',
      email: '',
    },
    image: {
      filename: '',
      originalname: '',
    },
    reviews: [
      {
        review: '',
        rating: 0,
        by: { user_id: '', fullname: '' },
        date: 0,
      },
    ],
  });

  constructor() {
    effect(() => {
      this.$medications();
      this.$medicine();
    });
  }

  postMeddication(medicineFormData: FormData) {
    return this.#http.post<{ success: boolean; data: IMedication; }>(
      environment.BACKEND_SERVER_URL + '/medications',
      medicineFormData
    );
  }

  getMedicationsByFirstLetter(letter: string) {
    return this.#http.get<{ success: boolean; data: IMedication[]; }>(
      environment.BACKEND_SERVER_URL +
      '/medications' +
      '?' +
      `first_letter=${letter}`
    );
  }

  getMedicationById(medicationId: string) {
    return this.#http.get<{ success: boolean; data: IMedication; }>(
      environment.BACKEND_SERVER_URL + '/medications/' + medicationId
    );
  }

  updateMedicationById(medication_id: string, medicineFormData: FormData) {
    return this.#http.put<{ success: boolean; data: boolean; }>(
      environment.BACKEND_SERVER_URL + '/medications/' + medication_id,
      medicineFormData
    );
  }

  deleteMedicationById(medication_id: string) {
    return this.#http.delete<{ success: boolean; data: boolean; }>(
      environment.BACKEND_SERVER_URL + '/medications/' + medication_id
    );
  }

  verifyMedicationExist(object: { medication_name: string; }) {
    return this.#http.post(
      environment.BACKEND_SERVER_URL + '/medications/verify',
      object
    );
  }
}
