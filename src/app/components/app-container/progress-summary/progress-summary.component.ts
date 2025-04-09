// src/app/components/progress-summary/progress-summary.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskMockService } from '../../../services/task-mock.service';
import { DailyProgressStats } from '../../../models/daily-progress-stats.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-summary.component.html',
  styleUrls: ['./progress-summary.component.scss']
})
export class ProgressSummaryComponent implements OnInit, OnDestroy {
  progressStats: DailyProgressStats | null = null;
  
  private subscription = new Subscription();

  constructor(private taskService: TaskMockService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.taskService.progressStats$.subscribe(stats => {
        this.progressStats = stats;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}