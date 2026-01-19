# SmartStudent

> AI-Augmented Learning Management System - Frontend Implementation

SmartStudent is an AI-Augmented Learning Management System (LMS) designed to unify the currently fragmented higher-education experience. It combines course material access, intelligent assessment, and personal productivity tools into one cohesive web interface.

---

## 🎯 Project Context

This frontend implementation addresses the following core problems (from [CONTEXT.md](CONTEXT.md)):

| Problem | Solution |
|---------|----------|
| **Feedback Latency** | AI-generated grading with instant feedback display |
| **System Fragmentation** | Unified dashboard merging academic deadlines + personal goals |

### Primary Users
- **Student**: Consumes content, submits work, manages personal schedule, views AI-generated feedback
- **Lecturer**: Creates courses, uploads materials, sets assignments, oversees grading with AI assistance

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will open at **http://localhost:8080**

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5.4 |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | shadcn-ui (48+ components) |
| **Routing** | React Router v6 |
| **State** | AuthContext + TanStack Query |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                     # shadcn-ui components (48+ components)
│   ├── AuthForm.tsx            # Login/signup with role selection
│   ├── Dashboard.tsx           # Role-based dashboard (847 lines)
│   ├── Navigation.tsx          # Sidebar navigation
│   ├── NotificationDropdown.tsx # Bell icon notifications
│   ├── GradingPanel.tsx        # AI grading display + manual override
│   ├── AssignmentCreationForm.tsx
│   ├── CourseCreationForm.tsx
│   ├── MaterialUpload.tsx      # Drag-drop file upload
│   ├── CalendarWidget.tsx      # Mini calendar for dashboard
│   └── GoalTracker.tsx         # Goals widget for dashboard
│
├── contexts/
│   └── AuthContext.tsx         # Auth state (user, role) with persistence
│
├── data/
│   └── mockData.ts             # Comprehensive mock data (~900 lines)
│
├── pages/
│   ├── Index.tsx               # Entry: auth check → dashboard
│   ├── Courses.tsx             # Course grid with search/filter
│   ├── CourseDetail.tsx        # Tabs: Overview, Materials, Assignments, Students
│   ├── AssignmentDetail.tsx    # Student submit / Lecturer grade view
│   ├── MySubmissions.tsx       # Student submission history
│   ├── GradingQueue.tsx        # Lecturer pending queue
│   ├── CourseAnalytics.tsx     # Charts and performance data
│   ├── Calendar.tsx            # Full calendar + goals
│   ├── Goals.tsx               # Personal goals CRUD
│   ├── Profile.tsx             # Avatar + display name
│   ├── Settings.tsx            # Theme toggle + preferences
│   └── NotFound.tsx            # 404 page
│
└── App.tsx                     # Router configuration
```

---

## 🔐 Authentication & Roles

### How to Test

1. Launch the app → you'll see the **login screen**
2. Select a role: **Student** or **Lecturer** (toggle above form)
3. Enter any email/password (mock auth accepts anything)
4. The dashboard and features adapt to your selected role

### Role-Based Features

| Feature | Student | Lecturer |
|---------|:-------:|:--------:|
| View enrolled courses | ✅ | ✅ (courses they teach) |
| Submit assignments | ✅ | ❌ |
| View grades & AI feedback | ✅ | ❌ |
| Create courses | ❌ | ✅ |
| Upload materials | ❌ | ✅ |
| Create assignments | ❌ | ✅ |
| Grade submissions | ❌ | ✅ |
| View grading queue | ❌ | ✅ |
| View course analytics | ❌ | ✅ |
| Manage personal goals | ✅ | ✅ |
| View calendar | ✅ | ✅ |

---

## ✅ Feature Alignment with CONTEXT.md

This table shows how each CONTEXT.md requirement maps to the UI implementation:

### A. Authentication & Onboarding

| Context Requirement | UI Implementation | File |
|---------------------|-------------------|------|
| Sign Up/Login | Email/password form with validation | [AuthForm.tsx](src/components/AuthForm.tsx) |
| Role Identification | Student/Lecturer toggle pre-login | [AuthForm.tsx](src/components/AuthForm.tsx) |
| Profile Management | Avatar upload, display name edit | [Profile.tsx](src/pages/Profile.tsx) |

### B. Course Management (Lecturer Flow)

| Context Requirement | UI Implementation | File |
|---------------------|-------------------|------|
| Course Creation | Modal form with title, code, description | [CourseCreationForm.tsx](src/components/CourseCreationForm.tsx) |
| Material Upload | Drag-drop with progress bars | [MaterialUpload.tsx](src/components/MaterialUpload.tsx) |
| Analytics View | Charts showing performance data | [CourseAnalytics.tsx](src/pages/CourseAnalytics.tsx) |

### C. The Assessment Loop (Core Mechanic)

| Context Requirement | UI Implementation | File |
|---------------------|-------------------|------|
| Assignment Creation | Form with title, due date, rubric | [AssignmentCreationForm.tsx](src/components/AssignmentCreationForm.tsx) |
| Submission | Text input + file upload option | [AssignmentDetail.tsx](src/pages/AssignmentDetail.tsx) |
| AI Grading Display | Score + AI feedback panel | [GradingPanel.tsx](src/components/GradingPanel.tsx) |
| Human-in-the-Loop Override | Manual score/feedback edit | [GradingPanel.tsx](src/components/GradingPanel.tsx) |

### D. Student Life & Organization

| Context Requirement | UI Implementation | File |
|---------------------|-------------------|------|
| Calendar (Deadlines auto-added) | Full calendar with assignment deadlines | [Calendar.tsx](src/pages/Calendar.tsx) |
| Personal Goals | CRUD with categories and dates | [Goals.tsx](src/pages/Goals.tsx) |
| Dashboard Aggregation | Unified view: deadlines + goals + grades | [Dashboard.tsx](src/components/Dashboard.tsx) |
| Notifications | Dropdown with grades, assignments, reminders | [NotificationDropdown.tsx](src/components/NotificationDropdown.tsx) |

---

## 🎨 User Flows Walkthrough

### Student Journey

1. **Login** → Select "Student" role → Enter credentials
2. **Dashboard** → See:
   - Quick stats (courses, pending tasks, average grade, study streak)
   - Upcoming deadlines with due dates
   - Recent grades with AI/manual badges
   - AI study insights
   - Mini calendar and goals widget
3. **Courses** → Browse enrolled courses → Search/filter
4. **Course Detail** → View materials, assignments
5. **Assignment** → Read instructions → Submit text/file
6. **View Grade** → See AI score + feedback (when graded)
7. **My Submissions** → View all past submissions with filters
8. **Calendar** → See deadlines + personal goals on calendar
9. **Goals** → Create/edit/complete personal goals

### Lecturer Journey

1. **Login** → Select "Lecturer" role → Enter credentials
2. **Dashboard** → See:
   - Quick stats (students, pending grades, courses)
   - Courses you teach with pending submission badges
   - Recent submissions needing grading
3. **Courses** → "Create Course" button → Fill form
4. **Course Detail** → 
   - Upload materials (drag-drop)
   - Create assignments (with rubric for AI)
   - View Students tab with progress
5. **Assignment** → View all student submissions
6. **Grading Queue** → See all pending submissions across courses
7. **Grade** → Open grading panel → See AI score → Override if needed
8. **Analytics** → View charts for course performance

---

## 📊 Mock Data

> **Important**: This is a **frontend-only** implementation. All data is mocked.

The mock data system ([src/data/mockData.ts](src/data/mockData.ts)) includes:

- **4 courses** with unique details
- **8 assignments** across courses
- **16 student submissions** with varied scores
- **Personal goals** for calendar/goals pages
- **Notifications** (new assignments, grades, reminders)
- **Course analytics** with performance metrics

### Backend Integration Points

When connecting to a real backend (e.g., Supabase), replace the mock data calls with API calls:

```typescript
// Current (mock)
const courses = mockCourses;

// Future (Supabase)
const { data: courses } = await supabase.from('courses').select('*');
```

See [PLAN.md](PLAN.md) for the full backend integration reference table.

---

## 📐 Design System

### Color Palette
- **Primary**: Violet/Purple gradient
- **Success**: Green (scores 80%+)
- **Warning**: Yellow (scores 60-79%)
- **Error**: Red (overdue, scores <60%)
- **Neutral**: Slate grays

### UI Patterns
- **Cards**: Rounded corners with subtle shadows
- **Glass-morphism**: Dashboard widgets with backdrop blur
- **Badges**: Color-coded status indicators
- **Modals**: Centered dialogs for forms
- **Sheets**: Side panels for grading

---

## 📈 Implementation Status

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Core Assessment | Tasks 8-10 | ✅ Complete |
| Phase 2: Dashboard | Tasks 11, 13 | ✅ Complete |
| Phase 3: History & Queue | Tasks 12, 14 | ✅ Complete |
| Phase 4: Organization | Tasks 15-17 | ✅ Complete |
| Phase 5: Notifications | Task 18 | ✅ Complete |
| Phase 6: Account | Tasks 19-20 | ✅ Complete |
| Phase 7: Polish | Tasks 21-24 | 🔲 Remaining |

**Overall Progress: 20/24 tasks (83% complete)**

See [PLAN.md](PLAN.md) for detailed task breakdown.

---

## 🔮 Remaining Work (Polish Phase)

| Task | Description |
|------|-------------|
| **Task 21** | Loading States (skeleton loaders, spinners) |
| **Task 22** | Error Handling (error boundaries, retry buttons) |
| **Task 23** | Empty States (CTAs for empty lists) |
| **Task 24** | Mobile Responsiveness (bottom nav, touch targets) |

---

## 🔗 Related Documents

- [CONTEXT.md](CONTEXT.md) - System context and backend requirements
- [PLAN.md](PLAN.md) - Detailed UI implementation plan

---

## 📝 License

This project is proprietary to the SmartStudent team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or contributions, please:
- Open an issue on GitHub
- Submit a pull request
- Contact the development team

---

Built with ❤️ using React, TypeScript, and Vite
