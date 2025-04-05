// task-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskMockService } from '../../services/task-mock.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
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
    this.saveNewTask();
  }
}