// app-container.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProgressSummaryComponent } from '../progress-summary/progress-summary.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ProgressSummaryComponent, TaskListComponent],
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss']
})
export class AppContainerComponent {
  // You can add component logic here
}