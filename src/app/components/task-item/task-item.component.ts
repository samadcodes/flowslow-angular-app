// task-item.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  trigger, 
  state, 
  style, 
  animate, 
  transition, 
  keyframes 
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
  
  constructor(private taskService: TaskMockService) {}
  
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