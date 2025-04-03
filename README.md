I’m building a personal productivity web application called **FlowSlow**. The core idea is to help professionals, especially developers and remote workers, track their work activities throughout the day in a lightweight, reflective way.

### Concept:
FlowSlow is not a traditional task manager or project management tool. It’s a **personal time log** that helps users regain control and awareness of their time. In today’s fast-moving work culture, people often don’t remember what they did in a day or where their time went. This app is designed to slow things down—helping users **“feel” their time again**, like people used to in older, slower-paced eras.

### Stack:
- **Frontend**: Angular 18 (SCSS-based styling)
- **Backend**: .NET Core 8
- **Database**: SQL with Entity Framework Core
- For now, I am focusing on the **frontend only**, with mocked data and service calls. I will NOT integrate real APIs at this point.

### UI Philosophy:
The UI should be **simple, modern, but with a retro/vintage vibe**—soft colors, serif or notebook-style typography, and rounded tiles. The main screen has:
- A **“Single Task Mode” toggle** (optional: if one task starts, others auto-pause)
- A **floating “+ Add Task” button**
- A **list of task tiles** (each with task name, type, and tracked time)
- A **summary area** at the bottom or top

### Task Types:
- Productive
- Less Productive
- Break

### Task Priorities:
- Urgent & Important
- Urgent only
- Important only
- Neither

### Functional Flow (MVP):
1. User adds a task with name, optional description, type, and priority
2. User starts the task (a timer begins)
3. User can pause/resume task
4. If “Single Task Mode” is enabled, starting one task pauses others
5. Show all tasks for the day in a scrollable list
6. Provide a small daily summary (total time spent per type, number of tasks, etc.)

### Current Focus:
- Building the **Angular frontend** only
- Using **mocked service calls**, simulating data without a backend
- Planning to structure clean components and services
- Will style with a **vintage-inspired, modern UI**

Please help me with:
- Component planning and structure
- SCSS layout or styling suggestions
- Wireframing ideas
- Mock service/data design
- Task state management (timers, active vs paused)

Let’s build this project efficiently and beautifully, with attention to UX, aesthetics, and extensibility for future backend integration.

