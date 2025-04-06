// task-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  trigger, 
  state, 
  style, 
  animate, 
  transition, 
  keyframes,
  query,
  animateChild,
  group 
} from '@angular/animations';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskMockService } from '../../services/task-mock.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [
    // Creation animation for entry and exit of tasks
    trigger('taskAnimation', [
      transition(':enter', [
        style({ 
          transform: 'scale(0.9) translateY(-30px) translateX(30px)', 
          opacity: 0,
          transformOrigin: 'top right'
        }),
        animate('900ms cubic-bezier(0.16, 1, 0.3, 1)', keyframes([
          style({ 
            opacity: 0, 
            transform: 'scale(0.9) translateY(-30px) translateX(30px)',
            offset: 0 
          }),
          style({ 
            opacity: 0.3, 
            transform: 'scale(0.95) translateY(-15px) translateX(15px)', 
            offset: 0.4 
          }),
          style({ 
            opacity: 0.9, 
            transform: 'scale(1.015) translateY(0) translateX(0)', 
            offset: 0.85 
          }),
          style({ 
            opacity: 1,
            transform: 'scale(1) translateY(0) translateX(0)', 
            offset: 1 
          })
        ]))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ 
          opacity: 0,
          transform: 'scale(0.95)' 
        }))
      ])
    ]),
    
    // Edit focus animation for the new task input
    trigger('editAnimation', [
      state('editing', style({
        // transform: 'scale(1.02) translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      })),
      state('idle', style({
        transform: 'scale(1) translateY(0)',
        boxShadow: 'var(--shadow)'
      })),
      transition('idle => editing', [
        animate('200ms cubic-bezier(0.05, 0.7, 0.1, 1.0)')
      ]),
      transition('editing => idle', [
        animate('300ms cubic-bezier(0.3, 0.0, 0.8, 0.15)')
      ])
    ])
  ]
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  isAddingTask: boolean = false;
  
  private subscription = new Subscription();

  constructor(private taskService: TaskMockService) {}

  ngOnInit(): void {
    // Subscribe to tasks from the service
    this.subscription.add(
      this.taskService.tasks$.subscribe(tasks => {
        this.tasks = tasks;
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  addNewTask(): void {
    this.isAddingTask = true;
    this.newTaskTitle = '';
    
    // Focus on the input field after the DOM updates
    setTimeout(() => {
      const inputElement = document.getElementById('newTaskInput');
      if (inputElement) {
        inputElement.focus();
      }
    }, 0);
  }

  saveNewTask(): void {
    if (this.newTaskTitle.trim()) {
      this.taskService.addTask(this.newTaskTitle.trim());
      this.newTaskTitle = '';
    }
    this.isAddingTask = false;
  }

  cancelNewTask(): void {
    this.newTaskTitle = '';
    this.isAddingTask = false;
  }

  // Handle keyboard events for task input
  onTaskInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveNewTask();
    } else if (event.key === 'Escape') {
      this.cancelNewTask();
    }
  }

  // Handle blur event for task input
  onTaskInputBlur(): void {
    if (this.newTaskTitle.trim()) {
      this.saveNewTask();
    } else {
      this.cancelNewTask();
    }
  }
}