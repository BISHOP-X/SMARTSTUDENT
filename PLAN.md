# SmartStudent UI Implementation Plan

## Current Status Overview

### ✅ COMPLETED (7 items)

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

---

## 🔲 REMAINING TASKS (17 items)

### Priority 1: Core Academic Features

#### Task 8: Assignment Creation Form
- **Location:** Create `src/components/AssignmentCreationForm.tsx`
- **Trigger:** "Add Assignment" button in CourseDetail page
- **Fields Required:**
  - Title (Input, required)
  - Description/Instructions (Textarea, required) 
  - Due Date (DatePicker component)
  - Max Score (Number input, default 100)
  - Grading Rubric/Context (Textarea - this is the AI grading criteria)
  - Allow File Upload toggle
- **Validation:**
  - Title required
  - Due date must be in future
  - Max score > 0
- **Integration Points:**
  - Add "Add Assignment" button to CourseDetail Assignments tab (lecturer only)
  - Modal opens on click
  - onSubmit logs data (ready for API)

#### Task 9: Assignment Detail / Submission Page (Student View)
- **Location:** Create `src/pages/AssignmentDetail.tsx`
- **Route:** `/courses/:courseId/assignments/:assignmentId`
- **Student View Contains:**
  - Assignment title, description, due date, max score
  - Submission form:
    - Text editor (Textarea for answer)
    - OR file upload option
    - Submit button
  - Past submission (if exists):
    - Submitted content preview
    - Status badge (pending/graded)
    - Score display (if graded)
    - AI feedback display (if graded)
- **Lecturer View Contains:**
  - Assignment details (same as student)
  - List of all submissions
  - Each submission shows: student name, submitted time, status
  - Click submission → view student's work + grade

#### Task 10: Grading Interface (Lecturer)
- **Location:** Create `src/components/GradingPanel.tsx`
- **Usage:** Shown when lecturer clicks a submission in AssignmentDetail
- **Contains:**
  - Student's submitted content (text or file preview)
  - AI Score display (read-only initially)
  - AI Feedback display (read-only initially)
  - Override section:
    - Manual score input
    - Manual feedback textarea
    - "Save Override" button
  - Status: pending → graded indicator
- **Flow:**
  1. AI grade shown first
  2. Lecturer can accept or override
  3. Save persists changes

---

### Priority 2: Student Experience

#### Task 11: Student Dashboard Enhancements
- **Location:** Update `Dashboard.tsx`
- **Add:**
  - Upcoming deadlines section (next 5 assignments due)
  - Recent grades section (last 3 graded submissions)
  - "View All" links for each section
  - Quick stats: courses enrolled, assignments pending, average grade

#### Task 12: Submission History Page
- **Location:** Create `src/pages/MySubmissions.tsx`
- **Route:** `/submissions`
- **Contains:**
  - List of all student's submissions
  - Filter by course, status (pending/graded)
  - Each row: assignment name, course, submitted date, status, score
  - Click → navigate to assignment detail

---

### Priority 3: Lecturer Experience

#### Task 13: Lecturer Dashboard Enhancements
- **Location:** Update `Dashboard.tsx` (check userRole)
- **Add (when userRole === "lecturer"):**
  - "Courses I Teach" section
  - Pending submissions count per course
  - "Grade Now" quick action buttons
  - Recent submissions needing grading
  - Quick stats: total students, pending grades, courses count

#### Task 14: Grading Queue Page
- **Location:** Create `src/pages/GradingQueue.tsx`
- **Route:** `/grading`
- **Contains:**
  - List of all pending submissions across all lecturer's courses
  - Filter by course
  - Sort by submission date (oldest first)
  - Each row: student, assignment, course, submitted time
  - Click → open grading panel

#### Task 15: Course Analytics Page
- **Location:** Create `src/pages/CourseAnalytics.tsx`
- **Route:** `/courses/:id/analytics`
- **Contains:**
  - Grade distribution chart (bar chart)
  - Average score per assignment (line chart)
  - Submission rate over time
  - Top/bottom performers list
  - Export button (future feature)

---

### Priority 4: Organization Features

#### Task 16: Calendar Page
- **Location:** Create `src/pages/Calendar.tsx`
- **Route:** `/calendar`
- **Contains:**
  - Full calendar view (month/week/day toggle)
  - Academic events (assignment due dates - auto-populated)
  - Personal goals (user-created events)
  - Click date → create new goal
  - Click event → view details
- **Use:** react-big-calendar or build custom

#### Task 17: Personal Goals Page
- **Location:** Create `src/pages/Goals.tsx`
- **Route:** `/goals`
- **Contains:**
  - Goal creation form (title, date, category)
  - Goal list with checkboxes (todo/done)
  - Categories: Study, Personal, Health, etc.
  - Filter by status, category
  - Edit/delete goals

#### Task 18: Notifications System
- **Location:** Create `src/components/NotificationDropdown.tsx`
- **Trigger:** Bell icon in top bar
- **Contains:**
  - Dropdown panel with notification list
  - Notification types:
    - New assignment posted
    - Grade received
    - Deadline reminder (24h before)
  - Mark as read
  - "View All" link
  - Badge count on bell icon

---

### Priority 5: User Account

#### Task 19: Profile Page
- **Location:** Create `src/pages/Profile.tsx`
- **Route:** `/profile`
- **Contains:**
  - Avatar upload
  - Display name field
  - Email (read-only)
  - Role badge (Student/Lecturer)
  - Save changes button

#### Task 20: Settings Page
- **Location:** Create `src/pages/Settings.tsx`
- **Route:** `/settings`
- **Contains:**
  - Theme toggle (dark/light)
  - Notification preferences (toggles)
  - Language selection (future)
  - Account section: logout, delete account

---

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
│   ├── Dashboard.tsx       # ✅ done (needs enhancements)
│   ├── MaterialUpload.tsx  # ✅ done
│   ├── Navigation.tsx      # ✅ done
│   ├── AssignmentCreationForm.tsx  # 🔲 Task 8
│   ├── GradingPanel.tsx    # 🔲 Task 10
│   ├── NotificationDropdown.tsx    # 🔲 Task 18
│   └── ...
├── contexts/
│   └── AuthContext.tsx     # ✅ done
├── pages/
│   ├── Index.tsx           # ✅ done
│   ├── Courses.tsx         # ✅ done
│   ├── CourseDetail.tsx    # ✅ done
│   ├── AssignmentDetail.tsx    # 🔲 Task 9
│   ├── MySubmissions.tsx       # 🔲 Task 12
│   ├── GradingQueue.tsx        # 🔲 Task 14
│   ├── CourseAnalytics.tsx     # 🔲 Task 15
│   ├── Calendar.tsx            # 🔲 Task 16
│   ├── Goals.tsx               # 🔲 Task 17
│   ├── Profile.tsx             # 🔲 Task 19
│   ├── Settings.tsx            # 🔲 Task 20
│   └── NotFound.tsx        # ✅ done
└── ...
```

---

## Implementation Order (Recommended)

### Phase 1: Core Assessment Loop (Tasks 8-10)
This is the CORE MECHANIC of the app. Build this first.
1. Task 8: Assignment Creation Form
2. Task 9: Assignment Detail Page
3. Task 10: Grading Panel

### Phase 2: Dashboard Improvements (Tasks 11, 13)
4. Task 11: Student Dashboard Enhancements
5. Task 13: Lecturer Dashboard Enhancements

### Phase 3: History & Queue (Tasks 12, 14)
6. Task 12: Submission History Page
7. Task 14: Grading Queue Page

### Phase 4: Organization (Tasks 16, 17)
8. Task 16: Calendar Page
9. Task 17: Goals Page

### Phase 5: Analytics & Notifications (Tasks 15, 18)
10. Task 15: Course Analytics
11. Task 18: Notifications

### Phase 6: Account (Tasks 19, 20)
12. Task 19: Profile Page
13. Task 20: Settings Page

### Phase 7: Polish (Tasks 21-24)
14. Task 21: Loading States
15. Task 22: Error Handling
16. Task 23: Empty States
17. Task 24: Mobile Responsiveness

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
