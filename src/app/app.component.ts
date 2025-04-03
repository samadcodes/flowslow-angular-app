// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppContainerComponent } from './components/app-container/app-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppContainerComponent],
  template: `<app-container></app-container>`,
})
export class AppComponent {
  title = 'flowslow';
}