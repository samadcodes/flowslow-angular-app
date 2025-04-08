// src/app/auth/components/typewriter-text/typewriter-text.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typewriter-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typewriter-text.component.html',
  styleUrls: ['./typewriter-text.component.scss']
})
export class TypewriterTextComponent implements OnInit, OnChanges, OnDestroy {
  @Input() text: string = '';
  @Input() typingSpeed: number = 50; // milliseconds per character
  @Input() startDelay: number = 500; // delay before typing starts
  @Input() deleteSpeed: number = 25; // milliseconds per character when deleting
  
  displayText: string = '';
  isBlinking: boolean = true;
  private typingInterval: any;
  private currentIndex: number = 0;
  private isDeleting: boolean = false;
  private typingTimeout: any;
  private toType: string = '';

  ngOnInit(): void {
    this.startTyping();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && !changes['text'].firstChange) {
      // Text changed, start deleting the current text
      this.isBlinking = false;
      this.isDeleting = true;
      clearTimeout(this.typingTimeout);
      clearInterval(this.typingInterval);
      this.startTyping();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.typingTimeout);
    clearInterval(this.typingInterval);
  }

  private startTyping(): void {
    this.toType = this.text;
    
    // If we need to delete existing text first
    if (this.isDeleting && this.displayText) {
      this.typingInterval = setInterval(() => {
        if (this.displayText.length > 0) {
          this.displayText = this.displayText.slice(0, -1);
        } else {
          clearInterval(this.typingInterval);
          this.isDeleting = false;
          this.currentIndex = 0;
          this.typingTimeout = setTimeout(() => {
            this.typeText();
          }, this.startDelay);
        }
      }, this.deleteSpeed);
    } else {
      // Start typing immediately or after delay
      this.typingTimeout = setTimeout(() => {
        this.typeText();
      }, this.startDelay);
    }
  }

  private typeText(): void {
    this.isBlinking = false;
    
    this.typingInterval = setInterval(() => {
      if (this.currentIndex < this.toType.length) {
        // Add next character
        this.displayText += this.toType.charAt(this.currentIndex);
        this.currentIndex++;
      } else {
        // Finished typing
        clearInterval(this.typingInterval);
        this.isBlinking = true;
      }
    }, this.typingSpeed);
  }
}