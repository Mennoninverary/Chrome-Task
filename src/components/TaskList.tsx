import React from 'react';
import { Task } from '../types';
import { CheckCircle2, Calendar, Bell } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
}

export default function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => onToggle(task.id)}
            className="focus:outline-none transition-colors"
          >
            <CheckCircle2 
              className={`w-5 h-5 ${
                task.completed 
                  ? 'text-green-500 fill-current' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 truncate">{task.description}</p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Calendar className="w-5 h-5 text-gray-400" />
            {task.recurrence && (
              <Bell className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}