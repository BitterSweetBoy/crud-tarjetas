import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'cards',
      },
      {
        path: 'cards',
        loadComponent: () => import('./cards/cards.component'),
      },
      {
        path: 'activity',
        loadComponent: () => import('./activity/activity.component'),
      }
    ],
  },
];
