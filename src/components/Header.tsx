import React from 'react';
import { PlusCircle, Folder, Download, Upload, Settings } from 'lucide-react';

interface HeaderProps {
  onNewTask: () => void;
  onNewProject: () => void;
  onExport: () => void;
  onImport: () => void;
}

export default function Header({ onNewTask, onNewProject, onExport, onImport }: HeaderProps) {
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onImport(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">Task Master</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={onNewProject}
          className="p-2 hover:bg-gray-100 rounded-full tooltip"
          title="New Project"
        >
          <Folder className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={onNewTask}
          className="p-2 hover:bg-gray-100 rounded-full tooltip"
          title="New Task"
        >
          <PlusCircle className="w-5 h-5 text-blue-600" />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          onClick={onExport}
          className="p-2 hover:bg-gray-100 rounded-full tooltip"
          title="Export Data"
        >
          <Download className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleImport}
          className="p-2 hover:bg-gray-100 rounded-full tooltip"
          title="Import Data"
        >
          <Upload className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}