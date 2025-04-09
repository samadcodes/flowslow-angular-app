// task-list.component.ts - Simplified with no entry animations
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskListItemComponent } from './task-list-item/task-list-item.component';
import { TaskMockService } from '../../../services/task-mock.service';
import { Task } from '../../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskListItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
  // No animations at list level anymore
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  temporaryTaskId: number | null = null;
  
  private subscription = new Subscription();

  constructor(private taskService: TaskMockService) {}

  ngOnInit(): void {
    // Subscribe to tasks from the service
    this.subscription.add(
      this.taskService.tasks$.subscribe(tasks => {
        this.tasks = tasks;
        
        // Check if our temporary task still exists
        if (this.temporaryTaskId !== null) {
          const tempTask = tasks.find(t => t.id === this.temporaryTaskId);
          if (!tempTask || !tempTask.isTemporary) {
            // If temporary task is gone or converted, reset temporaryTaskId
            this.temporaryTaskId = null;
          }
        }
      })
    );
    
    // Subscribe to temporary task conversion events
    this.subscription.add(
      this.taskService.taskConverted$.subscribe(taskId => {
        if (taskId === this.temporaryTaskId) {
          this.temporaryTaskId = null;
        }
      })
    );
    
    // Subscribe to task removal events
    this.subscription.add(
      this.taskService.taskRemoved$.subscribe(taskId => {
        if (taskId === this.temporaryTaskId) {
          this.temporaryTaskId = null;
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  addNewTask(): void {
    // First, check if there's already a temporary task
    if (this.temporaryTaskId !== null) {
      console.log('Already creating a task, temporaryTaskId:', this.temporaryTaskId);
      return;
    }
    
    // Create a temporary task and add it to the list in edit mode
    const tempTask = this.taskService.createTemporaryTask();
    this.temporaryTaskId = tempTask.id;
    console.log('Created new temporary task with ID:', this.temporaryTaskId);
    
    // Focus on the input field after the DOM updates
    setTimeout(() => {
      // Start editing the task we just created
      this.taskService.setTaskEditingState(this.temporaryTaskId!, true);
    }, 50);
  }
}