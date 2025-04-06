// task-item.component.ts (Animation Section)
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  trigger, 
  state, 
  style, 
  animate, 
  transition, 
  keyframes,
  group,
  query,
  animateChild
} from '@angular/animations';
import { Task } from '../../models/task.model';
import { Tag } from '../../models/tag.model';
import { TaskMockService } from '../../services/task-mock.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  animations: [
    // Main task animation - separate new task animation from regular animations
    trigger('taskAnimation', [
      // Leave animation stays the same
      transition(':leave', [
        animate('300ms ease-out', style({ 
          opacity: 0,
          transform: 'scale(0.95)' 
        }))
      ])
    ]),
    
    // New animation specifically for newly created tasks
    trigger('newTaskAnimation', [
      // This will only run when the task has the "isNew" flag set to true
      state('true', style({ transform: 'scale(1)', opacity: 1 })),
      state('false', style({ transform: 'scale(1)', opacity: 1 })),
      
      // Initial entry animation for new tasks
      transition('void => true', [
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
      ])
    ]),
    
    // Animation for status change (active/idle)
    trigger('statusChange', [
      // Define states for active and idle
      state('idle', style({
        transform: 'scale(1)',
        boxShadow: 'var(--shadow)'
      })),
      state('active', style({
        transform: 'scale(1)',
        boxShadow: 'var(--shadow)'
      })),
      // Transition when changing from idle to active
      transition('idle => active', [
        animate('400ms ease-out', keyframes([
          style({ transform: 'scale(0.98)', offset: 0.2 }),
          style({ transform: 'scale(1.03)', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', offset: 0.6 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ]),
      // Transition when changing from active to idle
      transition('active => idle', [
        animate('400ms ease-out', keyframes([
          style({ transform: 'scale(0.98)', offset: 0.2 }),
          style({ transform: 'scale(1.02)', offset: 0.6 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    
    // Animation for editing state
    trigger('editAnimation', [
      state('normal', style({
        transform: 'scale(1) translateY(0)',
        boxShadow: 'var(--shadow)'
      })),
      state('editing', style({
        transform: 'scale(1.02) translateY(-3px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      })),
      transition('normal <=> editing', [
        animate('250ms ease-out')
      ])
    ])
  ]
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  
  isEditingTitle: boolean = false;
  editedTitle: string = '';
  
  isAddingTag: boolean = false;
  newTagName: string = '';
  availableTags: Tag[] = [];
  filteredTags: Tag[] = [];
  
  // Add these getters for animation state control
  get statusState(): string {
    return this.task.status;
  }
  
  get editState(): string {
    return this.isEditingTitle || this.isAddingTag ? 'editing' : 'normal';
  }
  
  // Getter for the newTask animation state
  get isNewTask(): string {
    return this.task.isNew ? 'true' : 'false';
  }
  
  constructor(private taskService: TaskMockService) {}
  
  // Rest of your component code...
  
  ngOnInit() {
    // Initialize edited title from task
    this.editedTitle = this.task.title;
    
    // Subscribe to available tags
    this.taskService.tags$.subscribe(tags => {
      this.availableTags = tags;
      this.filteredTags = tags;
    });
    
    // Remove the isNew flag after animation completes
    if (this.task.isNew) {
      setTimeout(() => {
        this.task.isNew = false;
      }, 1000);
    }
  }
  
  toggleTaskStatus() {
    const newStatus = this.task.status === 'idle' ? 'active' : 'idle';
    this.taskService.updateTaskStatus(this.task.id, newStatus);
  }
  
  // Title editing methods
  startEditingTitle() {
    this.isEditingTitle = true;
    this.editedTitle = this.task.title;
    
    // Focus the input field after DOM update
    setTimeout(() => {
      const inputElement = document.getElementById(`taskTitle${this.task.id}`);
      if (inputElement) {
        inputElement.focus();
      }
    }, 0);
  }
  
  saveEditedTitle() {
    if (this.editedTitle.trim() !== '') {
      this.taskService.updateTaskTitle(this.task.id, this.editedTitle.trim());
    } else {
      this.editedTitle = this.task.title; // Reset to original if empty
    }
    this.isEditingTitle = false;
  }
  
  onTitleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.saveEditedTitle();
    } else if (event.key === 'Escape') {
      this.isEditingTitle = false;
      this.editedTitle = this.task.title; // Reset to original
    }
  }
  
  // Tag methods
  toggleAddTag() {
    this.isAddingTag = !this.isAddingTag;
    this.newTagName = '';
    this.filteredTags = this.availableTags;
    
    if (this.isAddingTag) {
      // Focus the input field after DOM update
      setTimeout(() => {
        const inputElement = document.getElementById(`tagInput${this.task.id}`);
        if (inputElement) {
          inputElement.focus();
        }
      }, 0);
    }
  }
  
  filterTags() {
    if (!this.newTagName.trim()) {
      this.filteredTags = this.availableTags;
      return;
    }
    
    const searchTerm = this.newTagName.trim().toLowerCase();
    this.filteredTags = this.availableTags.filter(tag => 
      tag.name.toLowerCase().includes(searchTerm)
    );
  }
  
  selectTag(tag: Tag) {
    this.taskService.addTagToTask(this.task.id, tag.name);
    this.newTagName = '';
    this.filteredTags = this.availableTags;
  }
  
  createAndAddTag() {
    if (!this.newTagName.trim()) return;
    
    // Check if tag already exists
    const existingTag = this.availableTags.find(
      tag => tag.name.toLowerCase() === this.newTagName.trim().toLowerCase()
    );
    
    if (existingTag) {
      this.selectTag(existingTag);
    } else {
      // Create new tag and add to task
      const newTag = this.taskService.addTag(this.newTagName.trim());
      this.taskService.addTagToTask(this.task.id, newTag.name);
      this.newTagName = '';
      this.filteredTags = this.availableTags;
    }
  }
  
  onTagInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.createAndAddTag();
    } else if (event.key === 'Escape') {
      this.toggleAddTag();
    }
  }
  
  removeTag(tagName: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent bubbling to parent elements
    this.taskService.removeTagFromTask(this.task.id, tagName);
  }
}