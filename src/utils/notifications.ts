import { chromeAPI } from './chrome-api';

export async function scheduleNotification(taskId: string, title: string, dueDate: string) {
  try {
    const alarmName = `task-${taskId}`;
    const scheduledTime = new Date(dueDate).getTime();

    await chromeAPI.alarms.create(alarmName, {
      when: scheduledTime
    });

    chromeAPI.notifications.create(alarmName, {
      type: 'basic',
      iconUrl: '/icons/icon128.png',
      title: 'Task Due',
      message: `Task "${title}" is due now!`,
      priority: 2
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

export async function cancelNotification(taskId: string) {
  try {
    const alarmName = `task-${taskId}`;
    await chromeAPI.alarms.clear(alarmName);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}