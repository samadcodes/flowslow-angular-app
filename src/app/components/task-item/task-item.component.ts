// task-item.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  title: string;
  tags: string[];
  duration: string;
  status: 'idle' | 'active' | 'completed';
}

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  
  toggleTaskStatus() {
    // In a real app, you'd implement a service to handle task status changes
    if (this.task.status === 'idle') {
      this.task.status = 'active';
    } else if (this.task.status === 'active') {
      this.task.status = 'idle';
    }
  }
}