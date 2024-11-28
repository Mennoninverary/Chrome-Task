import React from 'react';
import { Project } from '../types';
import { Folder } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ProjectList({ projects, selectedId, onSelect }: ProjectListProps) {
  return (
    <div className="space-y-2">
      {projects.map(project => (
        <button
          key={project.id}
          onClick={() => onSelect(project.id)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            selectedId === project.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <Folder className="w-5 h-5" style={{ color: project.color }} />
          <span>{project.name}</span>
        </button>
      ))}
    </div>
  );
}