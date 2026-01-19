# SmartStudent UI Implementation Plan

## Current Status Overview

### ✅ COMPLETED (20 items)

#### 1. Authentication & Role Selection
- **Files:** `AuthForm.tsx`, `AuthContext.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Login/signup form with email + password fields
  - Student/Lecturer toggle above form
  - Role passed to context on login
  - Auth state persists across navigation

#### 2. Navigation System
- **Files:** `Navigation.tsx`, `App.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Sidebar with Dashboard, Courses, Calendar, Goals, Analytics links
  - Collapsible sidebar
  - Active state highlighting
  - React Router integration
  - Protected routes (redirect to login if not authenticated)

#### 3. Dashboard Page
- **Files:** `Dashboard.tsx`, `TimeGreeting.tsx`, `CourseCard.tsx`, `CalendarWidget.tsx`, `GoalTracker.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Time-based greeting
  - Course cards grid (4 mock courses)
  - Calendar widget (mini calendar)
  - Goal tracker widget
  - Search bar, notifications icon
  - Course cards clickable → navigate to detail

#### 4. Courses Page
- **Files:** `Courses.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Course grid (3-column responsive)
  - Search bar with filtering
  - Status filter dropdown (all/active/completed)
  - "Create Course" button (lecturer only)
  - Course cards clickable → navigate to detail
  - Empty state when no courses

#### 5. Course Detail Page
- **Files:** `CourseDetail.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Hero image with course info overlay
  - Back button navigation
  - Stats bar (students, assignments, next class)
  - Tab navigation: Overview, Materials, Assignments, Students
  - Materials list with download buttons
  - Assignments list with status badges
  - Students tab (lecturer only) with progress
  - Dynamic course lookup by URL id
  - 4 mock courses with unique data

#### 6. Course Creation Form
- **Files:** `CourseCreationForm.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Modal dialog
  - Image upload with preview
  - Fields: title, code, credits, semester, description
  - Real-time validation
  - Integrated in Courses page

#### 7. Material Upload Component
- **Files:** `MaterialUpload.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Drag-and-drop zone
  - Multi-file support (10 files, 50MB each)
  - File validation (PDF, DOCX, PPTX, etc.)
  - Progress bars per file
  - Editable titles
  - Remove individual files
  - Integrated in CourseDetail page

#### 8. Assignment Creation Form
- **Files:** `AssignmentCreationForm.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Modal dialog with comprehensive form
  - Fields: title, description, due date, max score, grading rubric
  - Allow file upload toggle (Switch component)
  - Real-time validation (future dates, min 20 chars description, min 50 chars rubric)
  - Character counters for description and rubric
  - Info alert explaining AI grading context
  - Integrated into CourseDetail Assignments tab (lecturer only)
  - "Create Assignment" button opens modal

#### 9. Assignment Detail / Submission Page
- **Files:** `AssignmentDetail.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Route: `/courses/:courseId/assignments/:assignmentId`
  - Dual view based on role
  - **Student View:**
    - Assignment instructions display
    - Due date with badges (overdue/due soon)
    - Submission form (textarea for text answer)
    - File upload option (if enabled)
    - View past submission when exists
    - Status badge (pending/graded)
    - Score display with percentage
    - AI feedback panel in styled box
  - **Lecturer View:**
    - Assignment details and grading rubric
    - List of all student submissions (4 mock students)
    - Each submission shows: student name, submitted time, status, score
    - Click submission opens grading panel
    - Status badges and progress indicators
  - Back navigation to course detail
  - Assignments in CourseDetail now clickable

#### 10. Grading Panel
- **Files:** `GradingPanel.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Side sheet (Sheet component, 600px wide)
  - Student's submitted answer display
  - AI assessment section with gradient background
  - Score display (number + percentage)
  - AI feedback in styled box
  - Manual override section:
    - Edit score input
    - Edit feedback textarea
    - Save/Cancel buttons
    - Loading states during save
  - Shows which grade is active (AI vs manual)
  - Mock data for 4 students with varied scores (22, 78, 85, 92)
  - Integrated into AssignmentDetail (lecturer view)

#### 11. Student Dashboard Enhancements
- **Files:** `Dashboard.tsx` (updated)
- **Status:** ✅ Complete (Thoroughly Enhanced)
- **What's Done:**
  - **Quick Stats (4 cards):**
    - Courses enrolled, pending tasks, average grade with trend indicator
    - Study streak card with gamification (days in a row, fire icon)
  - **Next Class Countdown Card:**
    - Shows upcoming class with course title, time
    - Quick "View Course" action button
  - **Quick Actions Grid:**
    - 4-button grid for fast navigation (Submissions, Calendar, Goals, All Courses)
    - Icon-based with hover states
  - **Assignment Completion Rate:**
    - Progress bar showing completed vs total
    - Percentage display with detailed count
  - **Performance by Course:**
    - Mini progress bars for each course
    - Shows average grade per course (top 3)
  - **Upcoming Deadlines Section:**
    - Next 5 assignments with due dates
    - Status badges (overdue/due soon) with color coding
    - Days remaining countdown
    - Click to navigate to assignment detail
  - **Recent Grades Section:**
    - Last 3 graded submissions
    - Color-coded scores (excellent/good/fair/poor)
    - AI/Manual graded badges
    - Time ago display
  - **AI Study Insights Widget:**
    - Personalized insights based on performance
    - Grade improvement notifications
    - Assignment reminders with priority
    - Study time recommendations
  - **Recent Activity Feed:**
    - Last 4 activities (grades, submissions, materials, assignments)
    - Icon-based timeline with colored badges
    - "View All Activity" button
  - **Original Widgets:** Calendar and Goal Tracker
  - **Empty States:** Helpful messages when no data
  - **Conditional Rendering:** Only shows for student role
  - **Responsive Layout:** 4-column stats, 2-column actions, 3-column main grid

#### 12. Submission History Page
- **Files:** `MySubmissions.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Route: `/submissions`
  - Statistics cards (total, graded, pending, average grade)
  - Search bar (filters by assignment/course name)
  - Course filter dropdown (all courses)
  - Status filter (all/graded/pending)
  - Sortable table (by submitted date, score, course)
  - Each row shows: assignment, course, submitted time, status badge, score with percentage
  - Color-coded scores (excellent/good/fair/poor)
  - AI/Manual graded badges
  - Click row to view assignment detail
  - Empty states for no submissions or filtered results
  - Results count display

#### 13. Lecturer Dashboard Enhancements
- **Files:** `Dashboard.tsx` (updated)
- **Status:** ✅ Complete
- **What's Done:**
  - Quick stats cards (total students, pending grades, courses teaching)
  - "Courses I Teach" section with course cards
  - Each course shows: title, code, students count, average grade, pending submissions badge
  - "Grade Now" buttons on courses with pending work
  - Recent submissions section (5 most recent pending)
  - Each submission shows: student, assignment, course, time ago, "Grade" button
  - Oldest first sorting (most urgent at top)
  - "View Queue" link to grading page
  - Empty state when all caught up
  - Conditional rendering based on userRole === "lecturer"

#### 14. Grading Queue Page
- **Files:** `GradingQueue.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Route: `/grading`
  - Statistics cards (total pending, unique students, unique assignments, oldest waiting days)
  - Search bar (filters by student/assignment/course)
  - Course filter dropdown
  - Sortable table (by submitted date, student name, course)
  - Each row shows: student avatar/name, assignment, course badge, time ago, days waiting, max score
  - Urgent badges for submissions waiting 3+ days
  - "View" and "Grade Now" buttons
  - Opens GradingPanel on "Grade Now" click
  - Integrated GradingPanel component
  - Empty state when all caught up (success message)
  - Results count display
  - Only shows pending submissions (status filtering)

#### 15. Course Analytics Page
- **Files:** `CourseAnalytics.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Route: `/courses/:id/analytics`
  - Lecturer-only page with comprehensive course insights
  - Quick stats: total students, average grade, submission rate, top performer
  - Grade distribution bar chart (5 ranges with color coding)
  - Performance trend line chart (scores over time)
  - Top performers list (top 3 students with rankings)
  - Struggling students list (students needing support)
  - Assignment performance breakdown (each assignment's avg score and submission rate)
  - Tabbed interface: Overview, Assignments, Students
  - Export report button (mock functionality)
  - Color-coded badges and progress bars throughout
  - Integrated with mockCourseAnalytics data for 3 courses

#### 16. Calendar Page
- **Files:** `Calendar.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Route: `/calendar`
  - Full month calendar view with interactive date selection
  - Assignment deadlines auto-populated from course data
  - Personal goals integration from mockPersonalGoals
  - Color-coded event indicators (violet for assignments, blue for study goals, etc.)
  - Click date to view events for that day
  - Upcoming events sidebar (next 7 days)
  - Create goal dialog with full form (title, description, category, date/time)
  - Event type legend (assignments, overdue, study, health, personal)
  - Today highlighting and navigation (previous/next month, today button)
  - Events displayed with course names and times
  - Overdue assignment indicators in red
  - Responsive grid layout with proper spacing

#### 17. Goals Page
- **Files:** `Goals.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Route: `/goals`
  - Full CRUD functionality for personal goals
  - Statistics cards: total goals, completed, completion rate, upcoming
  - Create goal dialog (title, description, category, target date/time)
  - Tabbed view: To Do, Completed, All
  - Checkbox toggle for goal completion status
  - Edit goal dialog (all fields editable)
  - Delete goal with single click
  - Category filter (all, study, personal, health, career, other)
  - Status filter (all, todo, done)
  - Color-coded category badges (blue for study, emerald for health, etc.)
  - Overdue goal badges for past-due items
  - Goal cards show: title, description, category, date/time, actions
  - Empty states for each tab with helpful messages
  - Results count display showing filtered vs total
  - Full state management with useState hooks

#### 18. Notifications System
- **Files:** `NotificationDropdown.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Dropdown panel triggered by bell icon
  - Notification types: new assignment, grade received, deadline reminder
  - Mark individual as read / mark all as read
  - Unread count badge on bell icon
  - "View All" link and empty state
  - Color-coded icons by notification type
  - Time ago display for each notification
  - Integrated into Dashboard header

#### 19. Profile Page
- **Files:** `Profile.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Route: `/profile`
  - Avatar upload with preview and fallback initials
  - Display name editable field
  - Email display (read-only)
  - Role badge (Student/Lecturer)
  - Member since date display
  - Save changes button with loading state
  - Form validation for display name

#### 20. Settings Page
- **Files:** `Settings.tsx`
- **Status:** ✅ Complete
- **What's Done:**
  - Route: `/settings`
  - Appearance section with theme toggle (dark/light)
  - Notification preferences (toggles for each type)
  - Email, assignment, grade, deadline notification toggles
  - Account section with logout and delete account
  - Delete account with confirmation dialog
  - Danger zone styling for destructive actions

---

## 🔲 REMAINING TASKS (4 items)

### Priority 6: Polish & UX

#### Task 21: Loading States
- **Location:** Update all pages
- **Add:**
  - Skeleton loaders for course cards
  - Skeleton for course detail
  - Loading spinner for form submissions
  - Page transition animations

#### Task 22: Error Handling
- **Location:** Update all pages
- **Add:**
  - Error boundaries
  - "Something went wrong" fallback UI
  - Retry buttons
  - Network error detection

#### Task 23: Empty States
- **Location:** Update all list pages
- **Add:**
  - No courses enrolled (student)
  - No submissions yet
  - No assignments yet
  - No notifications
  - Helpful CTA buttons for each

#### Task 24: Mobile Responsiveness
- **Location:** All components
- **Add:**
  - Bottom navigation bar (mobile)
  - Collapsible sidebar auto-close on mobile
  - Touch-friendly targets
  - Responsive tables → cards on mobile

---

## File Structure After Completion

```
src/
├── components/
│   ├── ui/                 # shadcn components (done)
│   ├── AuthForm.tsx        # ✅ done
│   ├── CourseCard.tsx      # ✅ done
│   ├── CourseCreationForm.tsx  # ✅ done
│   ├── Dashboard.tsx       # ✅ done (Tasks 11 & 13)
│   ├── MaterialUpload.tsx  # ✅ done
│   ├── Navigation.tsx      # ✅ done (updated for roles)
│   ├── AssignmentCreationForm.tsx  # ✅ done (Task 8)
│   ├── GradingPanel.tsx    # ✅ done (Task 10)
│   ├── NotificationDropdown.tsx    # ✅ done (Task 18)
│   ├── CalendarWidget.tsx  # ✅ done
│   ├── GoalTracker.tsx     # ✅ done
│   ├── TimeGreeting.tsx    # ✅ done
│   ├── NavLink.tsx         # ✅ done
│   └── RoleSelection.tsx   # ✅ done
├── contexts/
│   └── AuthContext.tsx     # ✅ done
├── data/
│   └── mockData.ts         # ✅ done (comprehensive mock data)
├── pages/
│   ├── Index.tsx           # ✅ done
│   ├── Courses.tsx         # ✅ done
│   ├── CourseDetail.tsx    # ✅ done
│   ├── AssignmentDetail.tsx    # ✅ done (Task 9)
│   ├── MySubmissions.tsx       # ✅ done (Task 12)
│   ├── GradingQueue.tsx        # ✅ done (Task 14)
│   ├── CourseAnalytics.tsx     # ✅ done (Task 15)
│   ├── Calendar.tsx            # ✅ done (Task 16)
│   ├── Goals.tsx               # ✅ done (Task 17)
│   ├── Profile.tsx             # ✅ done (Task 19)
│   ├── Settings.tsx            # ✅ done (Task 20)
│   └── NotFound.tsx        # ✅ done
└── ...
```

---

## Implementation Order (Recommended)

### Phase 1: Core Assessment Loop (Tasks 8-10) ✅ COMPLETE
This is the CORE MECHANIC of the app.
1. ✅ Task 8: Assignment Creation Form
2. ✅ Task 9: Assignment Detail Page
3. ✅ Task 10: Grading Panel

### Phase 2: Dashboard Improvements (Tasks 11, 13) ✅ COMPLETE
4. ✅ Task 11: Student Dashboard Enhancements
5. ✅ Task 13: Lecturer Dashboard Enhancements

### Phase 3: History & Queue (Tasks 12, 14) ✅ COMPLETE
6. ✅ Task 12: Submission History Page
7. ✅ Task 14: Grading Queue Page

### Phase 4: Organization (Tasks 15-17) ✅ COMPLETE
8. ✅ Task 15: Course Analytics Page
9. ✅ Task 16: Calendar Page
10. ✅ Task 17: Goals Page

### Phase 5: Notifications (Task 18) ✅ COMPLETE
11. ✅ Task 18: Notifications System

### Phase 6: Account (Tasks 19, 20) ✅ COMPLETE
12. ✅ Task 19: Profile Page
13. ✅ Task 20: Settings Page

### Phase 7: Polish (Tasks 21-24) 🔲 REMAINING
14. 🔲 Task 21: Loading States
15. 🔲 Task 22: Error Handling
16. 🔲 Task 23: Empty States
17. 🔲 Task 24: Mobile Responsiveness

---

## Mock Data Needed

Each task should use mock data until backend is integrated. Define mocks in the component or a shared file:

```typescript
// src/data/mockData.ts
export const mockAssignments = [...];
export const mockSubmissions = [...];
export const mockNotifications = [...];
export const mockGoals = [...];
```

---

## Notes for Implementation

1. **All forms use React Hook Form + Zod** (already in dependencies)
2. **All modals use shadcn Dialog component**
3. **All lists should have empty states**
4. **Role-based rendering:** Check `userRole` prop to show/hide features
5. **Navigation paths must be added to App.tsx Routes**
6. **Every page needs Navigation sidebar**
7. **Console.log API data** - mark with `// TODO: API call` for backend integration

---

## Backend Integration Points (For Later)

When Supabase is connected, replace console.log with:

| Action | Supabase Method |
|--------|-----------------|
| Create course | `supabase.from('courses').insert()` |
| Upload material | `supabase.storage.upload()` + `from('course_materials').insert()` |
| Create assignment | `supabase.from('assignments').insert()` |
| Submit assignment | `supabase.from('submissions').insert()` |
| Get AI grade | Edge Function call |
| Override grade | `supabase.from('ai_feedback').update()` |
| Create goal | `supabase.from('personal_goals').insert()` |
| Get dashboard data | Multiple `supabase.from().select()` calls |

---

## Quick Reference: What Each Role Sees

### Student
- Dashboard: My courses, upcoming deadlines, recent grades
- Courses: Enrolled courses only
- Course Detail: Materials, Assignments (submit), NO Students tab
- Calendar: Deadlines + personal goals
- Goals: Personal goals CRUD
- Profile: View/edit own profile

### Lecturer
- Dashboard: Courses I teach, pending submissions, quick stats
- Courses: Created courses + "Create Course" button
- Course Detail: Materials (upload), Assignments (create), Students tab
- Grading Queue: All pending submissions
- Analytics: Course performance data
- Profile: View/edit own profile
