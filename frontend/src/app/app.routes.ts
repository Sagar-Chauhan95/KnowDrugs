import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { MedicinesComponent } from './medicines/medicines.component';
import { AuthenticationService } from './authentication/authentication.service';

export function isSignedIn() {
    const signed_in = inject(AuthenticationService).is_logged_in();
    const router = inject(Router);
    if (signed_in) {
        router.navigate([ '', 'medicines' ]);
        return false;
    } else {
        return true;
    }
}

export const routes: Routes = [
    { path: '', component: MedicinesComponent, pathMatch: "full" },
    {
        path: 'signin',
        canActivate: [ () => isSignedIn() ],
        loadComponent: () =>
            import('./authentication/sign-in.component').then(
                (c) => c.SignInComponent
            ),
    },
    {
        path: 'signup',
        canActivate: [ () => isSignedIn() ],
        loadComponent: () =>
            import('./authentication/sign-up.component').then(
                (c) => c.SignUpComponent
            ),
    },
    {
        path: 'medicines',
        loadChildren: () =>
            import('./medicines/medicine.routes').then((r) => r.medicineRoutes),
    },
    {
        path: 'medicines_letters',
        loadComponent: () =>
            import('./medicines/medications-with-letters.component').then(
                (c) => c.MedicationsWithLettersComponent
            ),
    },
    { path: '**', redirectTo: '' },
];
