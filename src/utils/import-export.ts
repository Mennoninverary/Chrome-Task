import { Task, Project } from '../types';
import { getTasks, getProjects, saveTasks, saveProjects } from './storage';

export async function exportData(): Promise<string> {
  try {
    const [tasks, projects] = await Promise.all([
      getTasks(),
      getProjects()
    ]);

    const data = {
      tasks,
      projects,
      version: '1.0'
    };

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export data');
  }
}

export async function importData(jsonString: string): Promise<void> {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    const tasks = Array.isArray(data.tasks) ? data.tasks : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];

    // Validate task and project data structure
    const validTasks = tasks.filter((task: any) => (
      task.id && 
      typeof task.title === 'string' &&
      typeof task.completed === 'boolean'
    ));

    const validProjects = projects.filter((project: any) => (
      project.id &&
      typeof project.name === 'string' &&
      typeof project.color === 'string'
    ));

    await Promise.all([
      saveTasks(validTasks),
      saveProjects(validProjects)
    ]);
  } catch (error) {
    console.error('Import error:', error);
    throw new Error('Failed to import data: Invalid format');
  }
}