import { Task, Project } from '../types';
import { chromeAPI } from './chrome-api';

export const StorageKeys = {
  TASKS: 'tasks',
  PROJECTS: 'projects',
} as const;

export async function getTasks(): Promise<Task[]> {
  try {
    const result = await chromeAPI.storage.local.get(StorageKeys.TASKS);
    return Array.isArray(result[StorageKeys.TASKS]) ? result[StorageKeys.TASKS] : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    if (!Array.isArray(tasks)) {
      console.error('Invalid tasks data:', tasks);
      return;
    }
    await chromeAPI.storage.local.set({ [StorageKeys.TASKS]: tasks });
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const result = await chromeAPI.storage.local.get(StorageKeys.PROJECTS);
    return Array.isArray(result[StorageKeys.PROJECTS]) ? result[StorageKeys.PROJECTS] : [];
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  try {
    if (!Array.isArray(projects)) {
      console.error('Invalid projects data:', projects);
      return;
    }
    await chromeAPI.storage.local.set({ [StorageKeys.PROJECTS]: projects });
  } catch (error) {
    console.error('Error saving projects:', error);
  }
}