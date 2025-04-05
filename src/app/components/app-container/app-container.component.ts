// src/app/components/app-container/app-container.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProgressSummaryComponent } from '../progress-summary/progress-summary.component';
import { WorkTimeInfoComponent } from '../work-time-info/work-time-info.component';
import { DailyQuoteComponent } from '../daily-quote/daily-quote.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskMockService } from '../../services/task-mock.service';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent,
    ProgressSummaryComponent, 
    WorkTimeInfoComponent, 
    DailyQuoteComponent, 
    TaskListComponent
  ],
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss']
})

export class AppContainerComponent {
  constructor(private taskService: TaskMockService) {}
}