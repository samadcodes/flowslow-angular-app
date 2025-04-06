// src/app/services/task-mock.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task } from '../models/task.model';
import { Tag } from '../models/tag.model';
import { WorkTimeInfo } from '../models/work-time-info.model';
import { DailyProgressStats } from '../models/daily-progress-stats.model';
import { DailyQuote } from '../models/daily-quote.model';

@Injectable({
  providedIn: 'root'
})
export class TaskMockService {
  // Mock data for tasks
  private tasksSubject = new BehaviorSubject<Task[]>([
    { 
      id: 1, 
      title: 'Design homepage layout', 
      tags: ['Design', 'Frontend'], 
      duration: '19m',
      elapsedSeconds: 19 * 60,
      status: 'idle',
      createdAt: new Date()
    },
    { 
      id: 2, 
      title: 'Set up API endpoints', 
      tags: ['Backend', 'API'], 
      duration: '1h 14m',
      elapsedSeconds: (1 * 60 * 60) + (14 * 60),
      status: 'active',
      createdAt: new Date()
    },
    { 
      id: 3, 
      title: 'Fix login page responsiveness', 
      tags: ['Frontend', 'Bug'], 
      duration: '2h 4m',
      elapsedSeconds: (2 * 60 * 60) + (4 * 60),
      status: 'idle',
      createdAt: new Date()
    },
    { 
      id: 4, 
      title: 'Update documentation', 
      tags: ['Documentation'], 
      duration: '43m',
      elapsedSeconds: 43 * 60,
      status: 'idle',
      createdAt: new Date()
    }
  ]);

  // Mock data for available tags
  private tagsSubject = new BehaviorSubject<Tag[]>([
    { id: 1, name: 'Frontend' },
    { id: 2, name: 'Backend' },
    { id: 3, name: 'Design' },
    { id: 4, name: 'API' },
    { id: 5, name: 'Bug' },
    { id: 6, name: 'Documentation' }
  ]);

  // Work time information
  private workTimeInfoSubject = new BehaviorSubject<WorkTimeInfo>({
    startTime: new Date(new Date().setHours(10, 11, 0, 0)), // 10:11 AM
    endTime: null,
    breakDuration: 49, // 49 minutes of break
    expectedEndTime: null
  });

  // Daily progress stats
  private progressStatsSubject = new BehaviorSubject<DailyProgressStats>({
    totalTime: '6h 54m',
    totalTimeInMinutes: (6 * 60) + 54,
    productiveTime: '4h 54m',
    productiveTimeInMinutes: (4 * 60) + 54,
    breakTime: '2h',
    breakTimeInMinutes: 2 * 60,
    tasksCompleted: 7
  });

  // Daily motivational quote
  private quoteSubject = new BehaviorSubject<DailyQuote>({
    text: 'The only way to go fast is to go well',
    author: 'Robert C. Martin'
  });

  // Timers for active tasks
  private activeTaskTimers: { [taskId: number]: any } = {};

  constructor() {
    // Calculate expected end time on initialization
    this.updateExpectedEndTime();
  }

  // Public getters for the observables
  get tasks$(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  get tags$(): Observable<Tag[]> {
    return this.tagsSubject.asObservable();
  }

  get workTimeInfo$(): Observable<WorkTimeInfo> {
    return this.workTimeInfoSubject.asObservable();
  }

  get progressStats$(): Observable<DailyProgressStats> {
    return this.progressStatsSubject.asObservable();
  }

  get quote$(): Observable<DailyQuote> {
    return this.quoteSubject.asObservable();
  }

  // Find a tag by name (case insensitive)
  findTagByName(name: string): Observable<Tag | undefined> {
    return this.tags$.pipe(
      map(tags => tags.find(tag => 
        tag.name.toLowerCase() === name.toLowerCase()
      ))
    );
  }

  // Add a new task
  addTask(title: string, tags: string[] = []): void {
    const tasks = this.tasksSubject.value;
    const newId = tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    
    const newTask: Task = {
      id: newId,
      title,
      tags,
      duration: '0m',
      elapsedSeconds: 0,
      status: 'idle',
      createdAt: new Date(),
      isNew: true // Set this flag to true for new tasks
    };
    
    this.tasksSubject.next([newTask, ...tasks]);
    
    // Update the task count in progress stats
    const stats = this.progressStatsSubject.value;
    this.progressStatsSubject.next({
      ...stats,
      tasksCompleted: stats.tasksCompleted + 1
    });
  }

  // Add a new tag
  addTag(name: string): Tag {
    const tags = this.tagsSubject.value;
    const newId = tags.length ? Math.max(...tags.map(tag => tag.id)) + 1 : 1;
    
    const newTag: Tag = {
      id: newId,
      name
    };
    
    this.tagsSubject.next([...tags, newTag]);
    
    return newTag;
  }

  // Update task status (start/stop)
  updateTaskStatus(taskId: number, status: 'idle' | 'active' | 'completed'): void {
    const tasks = this.tasksSubject.value;
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    const newStatus = status;
    
    // If starting a task
    if (newStatus === 'active' && task.status !== 'active') {
      // First, stop any currently active tasks
      const updatedTasks = tasks.map(t => {
        if (t.status === 'active' && t.id !== taskId) {
          this.stopTaskTimer(t.id);
          return { ...t, status: 'idle' };
        }
        return t;
      });
      
      // Start timer for this task
      this.startTaskTimer(taskId);
      
      updatedTasks[taskIndex] = { ...task, status: newStatus };
      this.tasksSubject.next(updatedTasks);
    } 
    // If stopping a task
    else if (newStatus === 'idle' && task.status === 'active') {
      this.stopTaskTimer(taskId);
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = { ...task, status: newStatus };
      this.tasksSubject.next(updatedTasks);
    }
    // If completing a task
    else if (newStatus === 'completed') {
      if (task.status === 'active') {
        this.stopTaskTimer(taskId);
      }
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = { ...task, status: newStatus };
      this.tasksSubject.next(updatedTasks);
    }
  }

  // Start a timer for a task
  private startTaskTimer(taskId: number): void {
    // Clear any existing timer for this task
    this.stopTaskTimer(taskId);
    
    // Start a new timer that updates task duration every second
    this.activeTaskTimers[taskId] = setInterval(() => {
      const tasks = this.tasksSubject.value;
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        this.stopTaskTimer(taskId);
        return;
      }
      
      const task = tasks[taskIndex];
      const elapsedSeconds = task.elapsedSeconds + 1;
      const duration = this.formatDuration(elapsedSeconds);
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = { ...task, elapsedSeconds, duration };
      this.tasksSubject.next(updatedTasks);
      
      // Also update the productive time in progress stats
      this.updateProgressStats();
    }, 1000);
  }

  // Stop the timer for a task
  private stopTaskTimer(taskId: number): void {
    if (this.activeTaskTimers[taskId]) {
      clearInterval(this.activeTaskTimers[taskId]);
      delete this.activeTaskTimers[taskId];
    }
  }

  // Format seconds into "Xh Ym" format
  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Update progress stats based on current task durations
  private updateProgressStats(): void {
    const tasks = this.tasksSubject.value;
    const totalSeconds = tasks.reduce((total, task) => total + task.elapsedSeconds, 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    
    const currentStats = this.progressStatsSubject.value;
    const updatedStats: DailyProgressStats = {
      ...currentStats,
      totalTime: this.formatDuration(totalSeconds),
      totalTimeInMinutes: totalMinutes,
      productiveTime: this.formatDuration(totalSeconds - (currentStats.breakTimeInMinutes * 60)),
      productiveTimeInMinutes: totalMinutes - currentStats.breakTimeInMinutes
    };
    
    this.progressStatsSubject.next(updatedStats);
  }

  // Update expected end time based on start time, breaks, and 8-hour workday
  updateExpectedEndTime(): void {
    const workTimeInfo = this.workTimeInfoSubject.value;
    
    if (workTimeInfo.startTime) {
      const startTime = new Date(workTimeInfo.startTime);
      // Add 8 hours + break duration to get expected end time
      const expectedEndTime = new Date(startTime.getTime() + (8 * 60 * 60 * 1000) + (workTimeInfo.breakDuration * 60 * 1000));
      
      this.workTimeInfoSubject.next({
        ...workTimeInfo,
        expectedEndTime
      });
    }
  }

  // Update work start time
  setWorkStartTime(time: Date): void {
    const workTimeInfo = this.workTimeInfoSubject.value;
    this.workTimeInfoSubject.next({
      ...workTimeInfo,
      startTime: time
    });
    this.updateExpectedEndTime();
  }

  // Update work end time
  setWorkEndTime(time: Date): void {
    const workTimeInfo = this.workTimeInfoSubject.value;
    this.workTimeInfoSubject.next({
      ...workTimeInfo,
      endTime: time
    });
  }

  // Update break duration
  setBreakDuration(minutes: number): void {
    const workTimeInfo = this.workTimeInfoSubject.value;
    this.workTimeInfoSubject.next({
      ...workTimeInfo,
      breakDuration: minutes
    });
    this.updateExpectedEndTime();
  }

  // Get task by ID
  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  // Edit task title
  updateTaskTitle(taskId: number, title: string): void {
    const tasks = this.tasksSubject.value;
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return;
    
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], title };
    this.tasksSubject.next(updatedTasks);
  }

  // Add tag to task
  addTagToTask(taskId: number, tagName: string): void {
    const tasks = this.tasksSubject.value;
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    
    // Check if tag already exists in task
    if (task.tags.some(tag => tag.toLowerCase() === tagName.toLowerCase())) {
      return;
    }
    
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { 
      ...task, 
      tags: [...task.tags, tagName] 
    };
    
    this.tasksSubject.next(updatedTasks);
  }

  // Remove tag from task
  removeTagFromTask(taskId: number, tagName: string): void {
    const tasks = this.tasksSubject.value;
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    const updatedTags = task.tags.filter(
      tag => tag.toLowerCase() !== tagName.toLowerCase()
    );
    
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { ...task, tags: updatedTags };
    
    this.tasksSubject.next(updatedTasks);
  }
}