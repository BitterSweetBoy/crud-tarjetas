import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgIcon, provideIcons} from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { heroDocument, heroBell } from '@ng-icons/heroicons/outline';


@Component({
  selector: 'app-layout',
  imports: [RouterModule, NgIcon, CommonModule],
  providers: [
    provideIcons({
      heroDocument, heroBell
    }),
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  mainNav = [
    { label: 'Cards', icon: "heroDocument", route: '/cards' },
    { label: 'Actividad', icon: "heroBell", route: '/activity' },
  ];

}
