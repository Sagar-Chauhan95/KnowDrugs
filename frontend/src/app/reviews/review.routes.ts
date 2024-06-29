import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { AuthenticationService } from '../authentication/authentication.service';
import { isSignedInAndMatch } from '../medicines/medicine.routes';
import { MedicationService } from '../medicines/medication.service';

export const reviewRoutes: Routes = [

    {
        path: '',
        loadComponent: () =>
            import('../medicines/medication-details.component').then(
                (c) => c.MedicationDetailsComponent
            ),
    },
    {
        path: 'reviews',
        loadComponent: () =>
            import('./reviews.component').then((c) => c.ReviewsComponent),
    },
    {
        path: 'reviews/add',
        canActivate: [ () => inject(AuthenticationService).is_logged_in() ],
        loadComponent: () =>
            import('./add-review.component').then((c) => c.AddReviewComponent),
    },
    {
        path: 'reviews/update/:review_id',
        canActivate: [ () => inject(AuthenticationService).is_logged_in() ],
        loadComponent: () =>
            import('./update-review.component').then((c) => c.UpdateReviewComponent),
    },
];
