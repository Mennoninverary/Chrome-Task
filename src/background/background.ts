import { getTasks, saveTasks } from '../utils/storage';
import { calculateNextDueDate } from '../utils/recurrence';
import { Task } from '../types';
import { chromeAPI } from '../utils/chrome-api';

chromeAPI.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm.name.startsWith('task-')) return;

  const taskId = alarm.name.replace('task-', '');
  const tasks = await getTasks();
  const task = tasks.find(t => t.id === taskId);

  if (!task) return;

  // Handle recurring tasks
  if (task.recurrence) {
    const nextDueDate = calculateNextDueDate(task);
    if (nextDueDate) {
      const updatedTask: Task = {
        ...task,
        dueDate: nextDueDate,
        completed: false
      };
      
      await saveTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    }
  }
});