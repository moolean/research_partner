/**
 * Document Viewer with Annotations
 */
import React, { useEffect, useState } from 'react';
import { Loader2, FileText, Tag } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { apiService } from '../services/api';

export const DocumentViewer: React.FC = () => {
  const {
    currentDocument,
    apiConfig,
    analysis,
    setAnalysis,
    isLoading,
    setIsLoading,
    selectedAnnotation,
    setSelectedAnnotation,
  } = useAppStore();

  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (currentDocument && apiConfig && !analysis) {
      analyzeDocument();
    }
  }, [currentDocument, apiConfig]);

  const analyzeDocument = async () => {
    if (!currentDocument || !apiConfig) return;

    setAnalyzing(true);
    setIsLoading(true);

    try {
      const result = await apiService.analyzeDocument(
        currentDocument.document_id,
        apiConfig
      );
      setAnalysis(result);
    } catch (err) {
      console.error('Error analyzing document:', err);
    } finally {
      setAnalyzing(false);
      setIsLoading(false);
    }
  };

  if (!currentDocument) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <FileText size={64} className="mx-auto mb-4" />
          <p>No document loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Document Header */}
      <div className="bg-white border-b p-4">
        <h2 className="text-xl font-bold mb-2">{currentDocument.title}</h2>
        {currentDocument.authors && (
          <p className="text-sm text-gray-600">
            By {currentDocument.authors.join(', ')}
          </p>
        )}
        {currentDocument.page_count && (
          <p className="text-sm text-gray-500 mt-1">
            {currentDocument.page_count} pages
          </p>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {analyzing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="animate-spin mx-auto mb-4" size={48} />
                <p className="text-gray-600">Analyzing document...</p>
                <p className="text-sm text-gray-400 mt-2">
                  This may take a minute
                </p>
              </div>
            </div>
          ) : analysis ? (
            <>
              {/* Summary Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  Summary
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="prose max-w-none whitespace-pre-wrap">
                    {analysis.summary}
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              {analysis.key_insights && analysis.key_insights.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                  <ul className="space-y-2">
                    {analysis.key_insights.map((insight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <span className="font-semibold text-green-700 mt-0.5">
                          •
                        </span>
                        <span className="text-gray-800">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Document Text with Highlights */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Document Content
                </h3>
                <div className="bg-white border rounded-lg p-6">
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {currentDocument.text ||
                      currentDocument.text_preview ||
                      'Document text not available'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <p>Loading analysis...</p>
              </div>
            </div>
          )}
        </div>

        {/* Annotations Sidebar */}
        {analysis && analysis.annotations && analysis.annotations.length > 0 && (
          <div className="w-96 border-l bg-gray-50 overflow-y-auto">
            <div className="p-4 bg-white border-b sticky top-0">
              <h3 className="font-semibold flex items-center gap-2">
                <Tag size={18} />
                Annotations ({analysis.annotations.length})
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {analysis.annotations.map((annotation, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAnnotation(idx)}
                  className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                    selectedAnnotation === idx
                      ? 'border-primary-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Type Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        annotation.type === 'concept'
                          ? 'bg-purple-100 text-purple-700'
                          : annotation.type === 'finding'
                          ? 'bg-green-100 text-green-700'
                          : annotation.type === 'methodology'
                          ? 'bg-blue-100 text-blue-700'
                          : annotation.type === 'result'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {annotation.type}
                    </span>
                    {annotation.page && (
                      <span className="text-xs text-gray-500">
                        Page {annotation.page}
                      </span>
                    )}
                  </div>

                  {/* Highlighted Text */}
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-900 italic">
                      "{annotation.text}"
                    </p>
                  </div>

                  {/* Note */}
                  <p className="text-sm text-gray-700">{annotation.note}</p>

                  {/* Expanded Content */}
                  {annotation.expanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Deep Dive:
                      </p>
                      <p className="text-sm text-gray-600">
                        {annotation.expanded}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
