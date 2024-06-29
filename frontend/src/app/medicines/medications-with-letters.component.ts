import { Component, effect, inject, input } from '@angular/core';
import { MedicationService } from './medication.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-medications-with-letters',
  standalone: true,
  imports: [ RouterLink ],
  template: `
    <div class="container">
      <!-- <div>Drugs: {{text()}}</div>
    @for(letter of letters; track letter){
      <button > {{text()}}{{letter}}</button>
    }  -->

      <div>
        <div class="group">
          <b>Most Common '{{ text() }}'' Drugs</b> <br />
          Common medications that begin with the letter <b>'{{ text() }}'</b>
        </div>
        @for(medication of medicationService.$medications(); track
        medication._id){
        <a [routerLink]="['', 'medicines', 'details', medication._id]"
          >{{ medication.name }}
        </a>
        <br />

        }
      </div>

      <!-- </div> -->
    </div>
  `,
  styleUrl: './specificMedication.css',
})
export class MedicationsWithLettersComponent {
  medicationService = inject(MedicationService);
  letterGroup = 'abcdefghijklmnopqrstuvwxyz';
  letters = this.letterGroup.toLowerCase().split('');
  text = input<string>();

  ngAfterViewInit(): void {
    this.medicationService
      .getMedicationsByFirstLetter(this.text()!)
      .subscribe((response) => {
        if (response.success) {
          this.medicationService.$medications.set(response.data);
        }
      });
  }
}
