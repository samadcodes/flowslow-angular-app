// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppContainerComponent } from './components/app-container/app-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, AppContainerComponent],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'FlowSlow';
}