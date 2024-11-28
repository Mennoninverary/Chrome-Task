import React, { useState, useEffect } from 'react';
import { Task, Project, AppState } from './types';
import { getTasks, saveTasks, getProjects, saveProjects } from './utils/storage';
import { scheduleNotification, cancelNotification } from './utils/notifications';
import { exportData, importData } from './utils/import-export';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import TaskDialog from './components/TaskDialog';
import ProjectDialog from './components/ProjectDialog';
import TaskList from './components/TaskList';

function App() {
  const [state, setState] = useState<AppState>({
    tasks: [],
    projects: [],
    selectedProjectId: null
  });
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [tasks, projects] = await Promise.all([getTasks(), getProjects()]);
      setState(prev => ({ ...prev, tasks, projects }));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async function handleAddTask(taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) {
    const task: Task = {
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...taskData
    };

    const updatedTasks = [...state.tasks, task];
    await saveTasks(updatedTasks);
    setState(prev => ({ ...prev, tasks: updatedTasks }));
    
    if (task.dueDate) {
      await scheduleNotification(task.id, task.title, task.dueDate);
    }
  }

  async function handleAddProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    const project: Project = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...projectData
    };

    const updatedProjects = [...state.projects, project];
    await saveProjects(updatedProjects);
    setState(prev => ({ ...prev, projects: updatedProjects }));
  }

  async function handleToggleTask(taskId: string) {
    const updatedTasks = state.tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    );
    await saveTasks(updatedTasks);
    setState(prev => ({ ...prev, tasks: updatedTasks }));

    const task = updatedTasks.find(t => t.id === taskId);
    if (task?.completed) {
      await cancelNotification(taskId);
    } else if (task?.dueDate) {
      await scheduleNotification(taskId, task.title, task.dueDate);
    }
  }

  async function handleExport() {
    try {
      const jsonData = await exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taskmaster-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  }

  async function handleImport(jsonString: string) {
    try {
      await importData(jsonString);
      await loadData();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check the file format and try again.');
    }
  }

  const filteredTasks = state.tasks.filter(
    task => !state.selectedProjectId || task.projectId === state.selectedProjectId
  );

  return (
    <div className="w-[400px] h-[600px] bg-gray-50 flex flex-col">
      <Header
        onNewTask={() => setIsTaskDialogOpen(true)}
        onNewProject={() => setIsProjectDialogOpen(true)}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          <ProjectList
            projects={state.projects}
            selectedId={state.selectedProjectId}
            onSelect={(id) => setState(prev => ({ ...prev, selectedProjectId: id }))}
          />
          
          <TaskList
            tasks={filteredTasks}
            onToggle={handleToggleTask}
          />
        </div>
      </div>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onSubmit={handleAddTask}
        projects={state.projects}
        selectedProjectId={state.selectedProjectId}
      />

      <ProjectDialog
        isOpen={isProjectDialogOpen}
        onClose={() => setIsProjectDialogOpen(false)}
        onSubmit={handleAddProject}
      />
    </div>
  );
}

export default App;