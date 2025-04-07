// task-item.component.ts with Enter/Leave Animations
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  trigger, 
  state, 
  style, 
  animate, 
  transition
} from '@angular/animations';
import { Task } from '../../models/task.model';
import { Tag } from '../../models/tag.model';
import { TaskMockService } from '../../services/task-mock.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  animations: [
    // EditState animation: for transitioning between edit and idle states
    trigger('editState', [
      // Idle state (default)
      state('idle', style({
        transform: 'scale(1) translateY(0)',
        boxShadow: 'var(--shadow)'
      })),
      
      // Edit state (lifted up with larger shadow)
      state('edit', style({
        transform: 'scale(1.02) translateY(-3px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      })),
      
      // Transitions between states with smooth animation
      transition('idle <=> edit', [
        animate('250ms cubic-bezier(0.05, 0.7, 0.1, 1.0)')
      ])
    ]),
    
    // Fade in/out animation for task appearance/removal
    trigger('fadeInOut', [
      // When task enters (is added to the list)
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      // When task leaves (is removed from the list)
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class TaskItemComponent implements OnInit, OnDestroy {
  @Input() task!: Task;
  @ViewChild('titleInput') titleInput?: ElementRef;
  
  isEditingTitle: boolean = false;
  editedTitle: string = '';
  
  isAddingTag: boolean = false;
  newTagName: string = '';
  availableTags: Tag[] = [];
  filteredTags: Tag[] = [];
  
  isTemporary: boolean = false;
  private subscription = new Subscription();
  
  // Get the current state for animation
  get editStateAnimation(): string {
    return (this.isEditingTitle || this.isAddingTag || this.isTemporary) ? 'edit' : 'idle';
  }
  
  constructor(private taskService: TaskMockService) {}
  
  ngOnInit() {
    // Initialize edited title from task
    this.editedTitle = this.task.title || '';
    
    // Check if this is a temporary task
    this.isTemporary = this.task.isTemporary === true;
    
    console.log('Task initialized:', this.task.id, 
                'Title:', this.task.title, 
                'isTemporary:', this.isTemporary);
    
    // If it's a temporary task, start editing automatically
    if (this.isTemporary) {
      setTimeout(() => {
        this.startEditingTitle();
      }, 10);
    }
    
    // Subscribe to available tags
    this.subscription.add(
      this.taskService.tags$.subscribe(tags => {
        this.availableTags = tags;
        this.filteredTags = tags;
      })
    );
    
    // Subscribe to editing state changes
    this.subscription.add(
      this.taskService.getTaskEditingState(this.task.id).subscribe(isEditing => {
        if (isEditing && !this.isEditingTitle) {
          this.startEditingTitle();
        }
      })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  toggleTaskStatus() {
    const newStatus = this.task.status === 'idle' ? 'active' : 'idle';
    this.taskService.updateTaskStatus(this.task.id, newStatus);
  }
  
  // Title editing methods
  startEditingTitle() {
    console.log('Starting to edit title for task:', this.task.id);
    this.isEditingTitle = true;
    this.editedTitle = this.task.title || '';
    
    // Focus the input field after DOM update
    setTimeout(() => {
      const inputElement = document.getElementById(`taskTitle${this.task.id}`);
      if (inputElement) {
        inputElement.focus();
      }
    }, 10);
  }
  
  saveEditedTitle() {
    console.log('Saving edited title for task:', this.task.id, 'New title:', this.editedTitle);
    
    if (this.editedTitle.trim() !== '') {
      // If this was a temporary task, convert it to a regular task
      if (this.isTemporary) {
        console.log('Converting temporary task to regular:', this.task.id);
        this.taskService.convertTemporaryTask(this.task.id, this.editedTitle.trim());
        this.isTemporary = false;
      } else {
        this.taskService.updateTaskTitle(this.task.id, this.editedTitle.trim());
      }
    } else {
      // If empty and temporary, remove the task
      if (this.isTemporary) {
        console.log('Removing empty temporary task:', this.task.id);
        this.taskService.removeTask(this.task.id);
        return;
      } else {
        this.editedTitle = this.task.title; // Reset to original if empty
      }
    }
    
    this.isEditingTitle = false;
  }
  
  onTitleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default behavior
      console.log('Enter pressed in title input for task:', this.task.id);
      this.saveEditedTitle();
    } else if (event.key === 'Escape') {
      event.preventDefault(); // Prevent default behavior
      console.log('Escape pressed in title input for task:', this.task.id);
      
      // If this is a temporary task and Escape is pressed, remove it
      if (this.isTemporary) {
        this.taskService.removeTask(this.task.id);
      } else {
        this.isEditingTitle = false;
        this.editedTitle = this.task.title; // Reset to original
      }
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
      }, 10);
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
      event.preventDefault(); // Prevent default behavior
      this.createAndAddTag();
    } else if (event.key === 'Escape') {
      event.preventDefault(); // Prevent default behavior
      this.toggleAddTag();
    }
  }
  
  removeTag(tagName: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent bubbling to parent elements
    this.taskService.removeTagFromTask(this.task.id, tagName);
  }
}