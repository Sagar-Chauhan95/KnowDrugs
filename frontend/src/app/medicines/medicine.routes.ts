import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { AuthenticationService } from '../authentication/authentication.service';
import { MedicationService } from './medication.service';

export function isSignedInAndMatch() {
    const authService = inject(AuthenticationService);
    const medicineService = inject(MedicationService);
    const router = inject(Router);

    if (
        authService.is_logged_in() &&
        authService.$state()._id === medicineService.$medicine().added_by.user_id
    ) {
        return true;
    } else {
        router.navigate([ '', 'medicines' ]);
        return false;
    }
}

export const medicineRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../medicines/medicines.component').then(
                (c) => c.MedicinesComponent
            ),
    },
    {
        path: 'add',
        canActivate: [ () => inject(AuthenticationService).is_logged_in() ],
        loadComponent: () =>
            import('../medicines/add-medicine.component').then(
                (c) => c.AddMedicineComponent
            ),
    },
    {
        path: 'update/:medicine_id',
        canActivate: [ () => isSignedInAndMatch() ],
        loadComponent: () =>
            import('../medicines/update-medicine.component').then(
                (c) => c.UpdateMedicineComponent
            ),
    },

    {
        path: 'details/:medicine_id',
        loadChildren: () =>
            import('../reviews/review.routes').then((r) => r.reviewRoutes),
    },
];
