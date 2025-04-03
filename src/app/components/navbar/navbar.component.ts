// navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  activePage = 'Home';
  
  // Navigation items
  navItems = [
    { name: 'Home', active: true },
    { name: 'Tasks', active: false },
    { name: 'Reports', active: false }
  ];
}