// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from './auth-header.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AuthHeaderComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  activeTab: string = 'tasks'; // Default active tab

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}