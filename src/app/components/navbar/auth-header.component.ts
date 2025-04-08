// src/app/components/navbar/auth-header.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/models/user.model';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss']
})
export class AuthHeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isDropdownOpen = false;
  private subscription = new Subscription();
  
  constructor(
    private authService: AuthService,
  ) {}
  
  ngOnInit(): void {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.closeDropdownOnClickOutside.bind(this));
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    document.removeEventListener('click', this.closeDropdownOnClickOutside.bind(this));
  }
  
  toggleDropdown(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdownOnClickOutside(event: MouseEvent): void {
    const userMenu = document.querySelector('.user-menu');
    if (this.isDropdownOpen && userMenu && !userMenu.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }
  
  getUserInitials(): string {
    if (!this.currentUser || !this.currentUser.username) {
      return '';
    }
    
    return this.currentUser.username.charAt(0).toUpperCase();
  }
  
  logout(): void {
    this.authService.logout();
  }
}