// src/app/components/daily-quote/daily-quote.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskMockService } from '../../services/task-mock.service';
import { DailyQuote } from '../../models/daily-quote.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily-quote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-quote.component.html',
  styleUrls: ['./daily-quote.component.scss']
})
export class DailyQuoteComponent implements OnInit, OnDestroy {
  quote: DailyQuote | null = null;
  
  private subscription = new Subscription();

  constructor(private taskService: TaskMockService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.taskService.quote$.subscribe(quote => {
        this.quote = quote;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}