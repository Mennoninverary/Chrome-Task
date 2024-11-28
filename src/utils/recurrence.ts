import { Task } from '../types';

export function calculateNextDueDate(task: Task): string | null {
  if (!task.recurrence) return null;

  const currentDue = new Date(task.dueDate);
  let nextDue: Date;

  switch (task.recurrence.type) {
    case 'daily':
      nextDue = new Date(currentDue);
      nextDue.setDate(currentDue.getDate() + task.recurrence.interval);
      break;

    case 'weekly':
      nextDue = new Date(currentDue);
      nextDue.setDate(currentDue.getDate() + (task.recurrence.interval * 7));
      break;

    case 'monthly':
      nextDue = new Date(currentDue);
      nextDue.setMonth(currentDue.getMonth() + task.recurrence.interval);
      break;

    default:
      return null;
  }

  return nextDue.toISOString();
}