// src/app/components/work-time-info/work-time-info.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskMockService } from '../../services/task-mock.service';
import { WorkTimeInfo } from '../../models/work-time-info.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-work-time-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-time-info.component.html',
  styleUrls: ['./work-time-info.component.scss']
})
export class WorkTimeInfoComponent implements OnInit, OnDestroy {
  workTimeInfo: WorkTimeInfo | null = null;
  
  private subscription = new Subscription();

  constructor(private taskService: TaskMockService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.taskService.workTimeInfo$.subscribe(info => {
        this.workTimeInfo = info;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formatTime(date: Date | null): string {
    if (!date) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  }
}