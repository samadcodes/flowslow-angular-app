// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, UserMenuComponent, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  activeTab: string = 'home'; // Default active tab
  isReportsDisabled: boolean = true; // Set to true to disable the Reports link

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}