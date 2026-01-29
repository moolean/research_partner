/**
 * Main Application Component
 */
import React from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { UploadPanel } from './components/UploadPanel';
import { DocumentViewer } from './components/DocumentViewer';
import { ChatInterface } from './components/ChatInterface';
import { useAppStore } from './store/appStore';
import { BookOpen } from 'lucide-react';

function App() {
  const { currentDocument } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={32} className="text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Research Partner
                </h1>
                <p className="text-sm text-gray-600">
                  AI-Powered Research Paper Analysis
                </p>
              </div>
            </div>
            <ConfigPanel />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {!currentDocument ? (
          <div className="py-12">
            <UploadPanel />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            {/* Document Viewer */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <DocumentViewer />
            </div>

            {/* Chat Interface */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ChatInterface />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
