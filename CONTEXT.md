# Context: SmartStudent Backend Development

## 1. Project Name
**SmartStudent**

## 2. Project Definition
**SmartStudent** is an AI-Augmented Learning Management System (LMS) designed to unify the currently fragmented higher-education experience. It serves as a single "operating system" for university students, combining course material access, intelligent assessment, and personal productivity tools into one cinematic, high-fidelity web interface.

**Core Problems Solved:**
1.  **Feedback Latency:** Traditional manual grading  takes weeks; SmartStudent provides immediate, constructive feedback.
2.  **System Fragmentation:** Students currently juggle separate portals for grades, emails for announcements, and personal calendars for planning. SmartStudent unifies these.

**Primary Users:**
* **Student:** Consumes content, submits work, manages personal schedule, receives AI tutoring.
* **Lecturer:** Creates courses, uploads materials, sets assignments with specific contexts, oversees grading.
* **System (AI):** Acts as the immediate grader, feedback generator, and study assistant.

**Key Value Propositions:**
* **Instant Feedback Loop:** AI-generated grading and detailed constructive feedback on assignments upon submission.
* **Unified Dashboard:** A single view merging academic deadlines (assignments, exams) with personal goals and schedules.
* **AI Study Assistance:** On-demand generation of practice quizzes and course summaries based on uploaded materials.

## 3. User Flows & Features

### A. Authentication & Onboarding
* **Sign Up/Login:** Users authenticate via email/password or social providers.
* **Role Identification:** The backend must distinguish between `student` and `lecturer` roles immediately upon session creation to serve the correct dashboard.
* **Profile Management:** Users can update avatars and display names.

### B. Course Management (Lecturer Flow)
* **Course Creation:** Lecturers can define new courses (Title, Code, Description).
* **Material Upload:** Lecturers upload PDFs, slides, or documents. The backend must securely store these files and associate them with the specific course.
* **Analytics View:** Lecturers can query aggregate performance data for their courses (e.g., average scores, completion rates).

### C. The Assessment Loop (Core Mechanic)
* **Assignment Creation:** Lecturers create assignments with a Title, Description, Due Date, and **Grading Context/Rubric** (text describing the correct answers or criteria).
* **Submission:** Students submit answers (text input or file).
* **Automated Grading Trigger:**
    * **Action:** When a submission is created, a backend process (Edge Function) is triggered.
    * **Logic:** The system sends the *Student's Answer* and the *Assignment Context* to an AI service.
    * **Result:** The AI returns a score (0-100) and structured text feedback.
    * **Persistence:** This data is immediately saved to the database and linked to the submission.
* **Human-in-the-Loop Override:** Lecturers can fetch any submission, review the AI grade, and overwrite the score or feedback manually.

### D. Student Life & Organization
* **Calendar Synchronization:**
    * **Automated:** When an Assignment is created, it must implicitly act as a "Deadline" event for all enrolled students.
    * **Manual:** Students can create "Personal Goals" (e.g., "Gym", "Study Session").
* **Dashboard Aggregation:** The backend must support queries that fetch and interleave both *Academic Deadlines* and *Personal Goals* ordered by time.

## 4. Data Requirements

The backend needs to manage the following entities in a relational structure:

* **Profiles:** `id` (references Auth), `full_name`, `role` (enum: student/lecturer), `avatar_url`.
* **Courses:** `id`, `title`, `course_code`, `description`, `lecturer_id` (FK).
* **Enrollments:** Linking table between `Profiles` (students) and `Courses`.
* **Course_Materials:** `id`, `course_id`, `file_path` (storage reference), `title`, `uploaded_at`.
* **Assignments:** `id`, `course_id`, `title`, `description` (AI Context), `due_date`, `max_score`.
* **Submissions:** `id`, `assignment_id`, `student_id`, `content_text` OR `file_url`, `status` (pending/graded), `submitted_at`.
* **AI_Feedback:** `id`, `submission_id`, `ai_score`, `feedback_text`, `created_at`.
* **Personal_Goals:** `id`, `user_id`, `title`, `event_date`, `status` (todo/done).

**Dynamic vs. Static:**
* Course materials are static files.
* Grades and feedback are dynamic and generated asynchronously via AI.
* Dashboard data is highly dynamic, requiring real-time fetching.

## 5. Business Logic & Rules

* **Role-Based Access Control (RBAC):**
    * **Students** view only courses they are enrolled in.
    * **Students** view only *their own* submissions and grades.
    * **Lecturers** can only edit/manage courses they created.
    * **Lecturers** view *all* submissions for their courses.
* **Grading Logic:**
    * Scores must be normalized to the assignment's `max_score`.
    * Feedback generation must be deterministic enough to be useful but does not need to be idempotent (regenerating feedback is allowed).
* **Data Integrity:**
    * Deleting a Course should cascade delete Assignments and Materials.
    * Deleting an Assignment should cascade delete Submissions.

## 6. Frontend Integration

* **Authentication:** The frontend uses a client-side SDK. The backend must validate session tokens for all data requests.
* **Real-time Updates:**
    * The frontend expects **WebSocket/Subscription** support.
    * *Scenario:* A student is viewing their dashboard. If a lecturer posts a new assignment, it should appear instantly without a refresh.
    * *Scenario:* After submitting an assignment, the grade should "pop in" live once the AI finishes processing.
* **API Interface:**
    * RESTful or Postgres-over-HTTP (Supabase client) for standard CRUD.
    * RPC (Remote Procedure Calls) or Edge Functions for complex actions like "Grade This Submission".

## 7. External Services & Integrations

* **AI / LLM Provider:**
    * **Service:** OpenAI (GPT-4o-mini) or Anthropic (Claude 3.5 Sonnet).
    * **Usage:**
        1.  **Grading:** `POST` request with prompt containing Rubric + Student Answer.
        2.  **Quiz Generation:** `POST` request with Course Material context to generate JSON-structured questions.
    * **Integration Pattern:** Must be called via a secure backend proxy (Edge Function) to protect API keys.

## 8. Security & Privacy

* **Row Level Security (RLS):** This is the primary security mechanism.
    * *Rule:* `auth.uid() == submission.student_id` (Student read policy).
    * *Rule:* `auth.uid() == course.lecturer_id` (Lecturer read policy for course data).
* **Sensitive Data:** Student grades are private data. The API must never expose a list of all grades to a user with the `student` role.
* **Storage Security:** File downloads for course materials should be behind signed URLs or RLS-protected storage buckets.

## 9. Performance & Scale

* **Latency Goal:** AI Grading must feel "near-instant" (target < 5-8 seconds). The backend should potentially handle this asynchronously if the model is slow, but synchronous return is preferred for the demo "wow" factor.
* **Concurrency:** The system should handle simultaneous submissions (e.g., an entire class submitting at the deadline) without dropping requests.
* **Read-Heavy Workload:** The dashboard will query multiple tables (Courses, Assignments, Goals) frequently. Indexes on `user_id` and `course_id` are essential.

## 10. Known Constraints & Technology Preferences

* **Architecture:** Serverless / Backend-as-a-Service (BaaS).
* **Preferred Stack:** **Supabase**.
    * **Database:** PostgreSQL.
    * **Auth:** Supabase Auth.
    * **Storage:** Supabase Storage.
    * **Logic:** Supabase Edge Functions (Deno/TypeScript).
* **Compliance:** For this specific demo build, GDPR/ISO compliance is *not* required, but basic data hygiene (no leaking emails/passwords) is mandatory.