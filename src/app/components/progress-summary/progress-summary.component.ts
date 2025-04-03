// progress-summary.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-summary.component.html',
  styleUrls: ['./progress-summary.component.scss']
})
export class ProgressSummaryComponent {
  todayStats = {
    totalTime: { hours: 6, minutes: 54 },
    tasksCompleted: 7,
    productiveTime: { hours: 4, minutes: 54 },
    breakTime: { hours: 2, minutes: 0 }
  };
  
  workTime = {
    started: '10:11 am',
    ended: '10:11 am'
  };
}