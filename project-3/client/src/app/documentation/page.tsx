// src/app/documentation/page.tsx
'use client';

import React, { useState } from 'react';
import { Folder, ChevronDown, ChevronRight, FileText, PlayCircle } from 'lucide-react';

type Section = 'overview' | 'client' | 'server';
type FolderSection = 'auth' | 'components' | 'pages' | null;

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [expandedFolder, setExpandedFolder] = useState<FolderSection>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const ClientFileStructure = () => (
    <div className="space-y-2">
      <div 
        className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
        onClick={() => setExpandedFolder(expandedFolder === 'auth' ? null : 'auth')}
      >
        {expandedFolder === 'auth' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <Folder size={16} className="mr-2 text-[var(--panda-red)]" />
        <span>auth</span>
      </div>
      {expandedFolder === 'auth' && (
        <div className="ml-6 space-y-1">
          <div 
            className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
            onClick={() => setSelectedFile('Modal')}
          >
            <FileText size={16} className="mr-2 text-gray-600" />
            <span>admin/employees/Modal.tsx</span>
          </div>
        </div>
      )}
    </div>
  );

  const ModalDocumentation = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Modal Component</h3>
        <p className="text-gray-600">A reusable modal component for employee management operations.</p>
        <div className="mt-4">
          <h4 className="font-medium mb-2">File Location:</h4>
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/app/(auth)/admin/employees/Modal.tsx
          </code>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Interfaces</h4>
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-semibold">Employee</h5>
            <pre className="bg-gray-100 p-3 rounded-lg text-sm mt-1">
{`interface Employee {
  employee_id: string;
  name: string;
  salary: number;
  position: string;
}`}
            </pre>
          </div>
          <div>
            <h5 className="text-sm font-semibold">ModalProps</h5>
            <pre className="bg-gray-100 p-3 rounded-lg text-sm mt-1">
{`interface ModalProps {
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
  onConfirmRemove: () => void;
  initialData?: Partial<Employee>;
  action: 'add' | 'update' | 'remove' | null;
}`}
            </pre>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Key Functions</h4>
        <div className="space-y-4">
          <div>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">handleChange</code>
            <p className="text-sm text-gray-600 mt-1">
              Handles input changes in the form and updates the form state.
            </p>
          </div>
          <div>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">handleSubmit</code>
            <p className="text-sm text-gray-600 mt-1">
              Processes form submission and calls the onSave prop with form data.
            </p>
          </div>
          <div>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">renderForm</code>
            <p className="text-sm text-gray-600 mt-1">
              Conditionally renders the appropriate form based on the action prop.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Usage Example</h4>
        <pre className="bg-gray-100 p-3 rounded-lg text-sm">
{`<Modal
  onClose={() => setModalVisible(false)}
  onSave={handleSaveEmployee}
  onConfirmRemove={handleRemoveEmployee}
  initialData={selectedEmployee}
  action="update"
/>`}
        </pre>
      </div>

      <div>
        <h4 className="font-medium mb-2">Notes</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Modal supports three actions: add, update, and remove</li>
          <li>Form fields are automatically populated when updating an employee</li>
          <li>Includes built-in form validation for required fields</li>
          <li>Responsive design with overlay background</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panda Express POS Documentation</h1>

      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-center h-96">
            <PlayCircle className="w-16 h-16 text-gray-400" />
            <p className="text-gray-500">Tutorial video coming soon</p>
          </div>
        </div>
      </section>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-4 py-2 rounded-lg ${
            activeSection === 'overview'
              ? 'bg-[var(--panda-red)] text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSection('client')}
          className={`px-4 py-2 rounded-lg ${
            activeSection === 'client'
              ? 'bg-[var(--panda-red)] text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Client Documentation
        </button>
        <button
          onClick={() => setActiveSection('server')}
          className={`px-4 py-2 rounded-lg ${
            activeSection === 'server'
              ? 'bg-[var(--panda-red)] text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Server Documentation
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-4">Project Structure</h3>
          {activeSection === 'client' && <ClientFileStructure />}
        </div>

        <div className="col-span-3 bg-white rounded-lg shadow-md p-6">
          {selectedFile === 'Modal' && <ModalDocumentation />}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
