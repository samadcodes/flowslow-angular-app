// task-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';

interface Task {
  id: number;
  title: string;
  tags: string[];
  duration: string;
  status: 'idle' | 'active' | 'completed';
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  tasks: Task[] = [
    { 
      id: 1, 
      title: 'Design homepage layout', 
      tags: ['Tag 1', 'Tag 2'], 
      duration: '19m',
      status: 'idle'
    },
    { 
      id: 2, 
      title: 'Design homepage layout', 
      tags: ['Tag 1', 'Tag 2'], 
      duration: '1h 14m',
      status: 'active'
    },
    { 
      id: 3, 
      title: 'Design homepage layout', 
      tags: ['Tag 1', 'Tag 2'], 
      duration: '2h 4m',
      status: 'idle'
    },
    { 
      id: 4, 
      title: 'Design homepage layout', 
      tags: ['Tag 1', 'Tag 2'], 
      duration: '43m',
      status: 'idle'
    }
  ];
}