import { Component, effect, inject, input, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';

import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../authentication/authentication.service';
import { MedicationService } from './medication.service';

@Component({
  selector: 'app-update-medicine',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  template: `
    <div class="container">
      <div class="title">Edit items to update</div>
      <form class="example-form" [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field class="example-full-width">
          <input
            type="text"
            matInput
            formControlName="name"
            placeholder="Enter name of medicine"
          />
        </mat-form-field>

        <mat-form-field class="example-full-width">
          <input
            type="text"
            matInput
            formControlName="generic_name"
            placeholder="Enter generic name"
          />
        </mat-form-field>
        <br />
        <mat-form-field class="example-full-width">
          <input
            type="text"
            matInput
            formControlName="medication_class"
            placeholder="Enter medication class"
          />
        </mat-form-field>

        <mat-radio-group formControlName="availability">
          Availability Status
          <mat-radio-button value="Prescription">Prescription</mat-radio-button>
          <mat-radio-button value="OTC">OTC</mat-radio-button>
        </mat-radio-group>

        <br />
        <img
          src="{{ $picture().originalname }}"
          alt="pic"
          width="100px"
          height="100px"
          style="margin-left: 300px; margin-right: -300px"
        />
        <input
          class="file"
          type="file"
          formControlName="image"
          (change)="setFile($event)"
        />
        <br />
        <button type="submit" [disabled]="form.invalid">submit</button>
      </form>
    </div>
  `,
  styleUrl: './addMedicine.css',
})
export class UpdateMedicineComponent {
  medicine_id = input.required<string>();
  readonly medicationService = inject(MedicationService);
  readonly #toastr = inject(ToastrService);
  readonly #router = inject(Router);
  readonly authService = inject(AuthenticationService);
  $picture = signal<{ filename: string; originalname: string; }>({
    filename: '',
    originalname: '',
  });
  file!: File;
  form = inject(FormBuilder).nonNullable.group({
    name: [ '', Validators.required ],
    generic_name: [ '', Validators.required ],
    medication_class: [ '', Validators.required ],
    availability: [ '', Validators.required ],
    image: '',
  });

  constructor() {
    effect(() => {
      this.medicationService
        .getMedicationById(this.medicine_id())
        .subscribe((response) => {
          if (response.success) {
            this.name.patchValue(response.data.name),
              this.generic_name.patchValue(response.data.generic_name);
            this.availability.patchValue(response.data.availability);
            this.medication_class.patchValue(response.data.medication_class);
            this.$picture.set(response.data.image!);
          }
        });
    });
  }

  get name() {
    return this.form.controls.name;
  }
  get generic_name() {
    return this.form.controls.generic_name;
  }
  get medication_class() {
    return this.form.controls.medication_class;
  }
  get availability() {
    return this.form.controls.availability;
  }
  get image() {
    return this.form.controls.image;
  }

  setFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files![ 0 ];
  }

  submit() {
    const formData = new FormData();
    formData.append('name', this.name.value);
    formData.append('generic_name', this.generic_name.value);
    formData.append('medication_class', this.medication_class.value);
    formData.append('availability', this.availability.value);
    formData.append('medication_image', this.file);
    this.medicationService
      .updateMedicationById(this.medicine_id(), formData)
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.#toastr.success('Medication Successfully updated');
            this.#router.navigate([ '', 'medicines' ]);
          }
        },
        error: (error) => {
          this.#toastr.error('Medication update Unsuccessfull');
        },
      });
  }
}
