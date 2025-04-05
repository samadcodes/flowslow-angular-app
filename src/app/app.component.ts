// src/app/app.component.ts
import { Component } from '@angular/core';
import { AppContainerComponent } from './components/app-container/app-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppContainerComponent],
  template: `
    <app-container></app-container>
  `,
  styles: []
})
export class AppComponent {
  title = 'FlowSlow';
}