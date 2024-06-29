import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';

import { MedicationService } from './medication.service';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  template: `
    <div class="container">
      <div class="title">Fill in details to add new medicine</div>
      <form class="example-form" [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field class="example-full-width">
          <input
            type="text"
            matInput
            formControlName="name"
            placeholder="Enter name of medicine"
          />
          @if(name.touched && name.dirty && name.invalid){
          @if(name.hasError('required')){
          <p>Medication name is required</p>
          } @if(name.hasError('exist')){
          <p>Medication already exist</p>
          } }
        </mat-form-field>

        <mat-form-field class="example-full-width">
          <input
            type="text"
            matInput
            formControlName="generic_name"
            placeholder="Enter generic name"
          />
          @if(generic_name.touched && generic_name.dirty &&
          generic_name.invalid){ @if(generic_name.hasError('required')){
          <p>Generic name is required</p>
          }}
        </mat-form-field>
        <br />
        <mat-form-field class="example-full-width">
          <input
            type="text"
            matInput
            formControlName="medication_class"
            placeholder="Enter medication class"
          />
          @if(medication_class.touched && medication_class.dirty &&
          medication_class.invalid){ @if(medication_class.hasError('required')){
          <p>Medication class is required</p>
          }}
        </mat-form-field>

        <mat-radio-group formControlName="availability">
          Availability Status
          <mat-radio-button value="Prescription">Prescription</mat-radio-button>
          <mat-radio-button value="OTC">OTC</mat-radio-button>
        </mat-radio-group>

        <br />
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
export class AddMedicineComponent {
  readonly #toastr = inject(ToastrService);
  readonly #router = inject(Router);

  readonly medicationService = inject(MedicationService);
  file!: File;
  form = inject(FormBuilder).nonNullable.group({
    name: [ '', Validators.required ],
    generic_name: [
      '',
      {
        validators: [ Validators.required ],
        updateOn: 'change',
      },
    ],
    medication_class: [ '', Validators.required ],
    availability: [ '', Validators.required ],
    image: '',
  });

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

  constructor() {
    this.name.valueChanges
      .pipe(
        debounceTime(1000),
        mergeMap((name) =>
          this.medicationService.verifyMedicationExist({
            medication_name: name,
          })
        )
      )
      .subscribe((response) => {
        this.name.setErrors(response);
      });
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
    this.medicationService.postMeddication(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.#toastr.success('Medication Successfully added');
          this.form.reset();
          this.medicationService.$medications.update((med) => [
            ...med,
            response.data,
          ]);
          this.#router.navigate([ '', 'medicines', 'medicines_letters' ]);
        }
      },
      error: (error) => {
        this.#toastr.error('Medication addition Unsuccessfull');
      },
    });
  }
}
