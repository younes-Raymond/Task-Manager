const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in progress', 'completed'],
      default: 'pending',
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    workerName: {
       type: String,
       required: false,
    },
    expectation: {
      type: String,
    },
    deadlineDays: {
      type: Number, 
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;


// Certainly, adding a modal (popup) for displaying task details when a worker clicks the "Start Task" button is a great idea. This would provide a clear and organized way for workers to review task information before confirming their intent. Here's how you can organize the suggested tasks:

// 1. **Task Modal Popup:**
//    - Implement a modal component that opens when the worker clicks the "Start Task" button.
//    - Display detailed task information such as title, description, priority, deadline, etc.
//    - Provide "OK" and "Cancel" buttons within the modal.

// 2. **Task Priority:**
//    - Add a "priority" field to the task model (e.g., low, medium, high).
//    - Display the priority level of each task alongside its title or within the modal.
//    - Allow workers to filter or sort tasks based on priority.

// 3. **Deadline and Date Comparison:**
//    - Add a "deadline" field to the task model.
//    - Implement logic to compare the current date with the task's deadline.
//    - Highlight or color-code tasks that are overdue or nearing their deadline.

// 4. **Task Status Transitions:**
//    - Define a clear flow for how tasks transition from "pending" to "in progress" to "completed" status.
//    - Use the modal to allow workers to confirm their intent to start a task, updating its status to "in progress."

// 5. **Task Filtering and Sorting:**
//    - Provide options to filter tasks by status (e.g., pending, in progress, completed) and priority.
//    - Allow sorting tasks based on different criteria, such as priority or deadline.

// 6. **Task Attachments and Notes:**
//    - Consider adding fields for task attachments (files/images) and worker notes.
//    - Allow workers to attach relevant files and add notes to tasks for better communication.

// 7. **Task Analytics:**
//    - If relevant, develop a dashboard or section where workers can view their task performance analytics.
//    - Display metrics such as completed tasks, average completion time, etc.

// 8. **User-Friendly UI:**
//    - Design the UI with user-friendliness in mind, making it easy for workers to navigate and manage tasks.
//    - Ensure that important information (like deadlines and priorities) is prominently displayed.

// Remember, the key is to enhance the user experience and productivity of the workers. Each feature you add should align with the goals of your application and the needs of your users. You can incrementally implement these features and gather user feedback to refine them over time. 





                  
// 1. **Notification Preferences:**
// Allow workers to choose how they receive notifications (email, in-app notifications) and set notification thresholds (e.g., receive notifications for high-priority tasks).

// 2. **Language and Localization:**
// Provide options to switch the application's language or locale to accommodate users from different regions.

// 3. **Theme Selection:**
// Allow workers to choose between different color themes or dark/light mode based on their visual preferences.

// 4. **Password and Security:**
// Enable workers to update their passwords or manage two-factor authentication settings.

// 5. **Timezone Configuration:**
// Let workers set their preferred timezone, which can affect task deadlines and notifications.

// 6. **Task Display Preferences:**
// Allow workers to customize how tasks are displayed (e.g., sort order, number of tasks per page).

// 7. **Profile Privacy:**
// Give workers control over what information is visible to other users in their profiles.

// 8. **Email Preferences:**
// Allow users to manage the types of email communications they receive from the application.

// 9. **Task Reminder Settings:**
// Let workers set reminders for approaching task deadlines, which can help them manage their workload.

// 10. **Accessibility Options:**
//  Include features like font size adjustment, screen reader compatibility, and keyboard shortcuts.

// 11. **Integration Preferences:**
//  If your application integrates with other tools, allow workers to configure those integrations.

// 12. **Help and Support:**
//  Provide access to help resources, support contact details, or a feedback form.

// 13. **Privacy Settings:**
//  Let users control the visibility of their activity and status to other users.

// 14. **Data Export and Backup:**
//  Offer the option to export task data or create backups for their records.

// 15. **Logout from Other Devices:**
//  Allow workers to log out from devices they are not using.

// Remember to keep the settings interface simple and intuitive. Each setting should have a clear description of its purpose, and it's a good idea to provide tooltips or guidance where necessary. Consider conducting user testing to ensure that the settings you provide are genuinely useful and align with your users' needs. 