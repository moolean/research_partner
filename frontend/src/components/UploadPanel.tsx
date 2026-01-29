/**
 * Upload Component - For PDF and ArXiv input
 */
import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import { useAppStore } from '../store/appStore';

export const UploadPanel: React.FC = () => {
  const { apiConfig, setCurrentDocument, setIsLoading, isLoading } = useAppStore();
  const [arxivUrl, setArxivUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'pdf' | 'arxiv'>('pdf');
  const [error, setError] = useState<string | null>(null);

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!apiConfig) {
      setError('Please configure your API settings first');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const document = await apiService.uploadPDF(file);
      setCurrentDocument(document);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArxivSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiConfig) {
      setError('Please configure your API settings first');
      return;
    }

    if (!arxivUrl) return;

    setError(null);
    setIsLoading(true);

    try {
      const document = await apiService.processArxiv(arxivUrl, apiConfig);
      setCurrentDocument(document);
      setArxivUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ArXiv paper');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Research Paper</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('pdf')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'pdf'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Upload className="inline mr-2" size={18} />
          Upload PDF
        </button>
        <button
          onClick={() => setActiveTab('arxiv')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'arxiv'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <LinkIcon className="inline mr-2" size={18} />
          ArXiv Link
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* PDF Upload */}
      {activeTab === 'pdf' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 mb-4">
              Click to upload or drag and drop your PDF file
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              disabled={isLoading || !apiConfig}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className={`btn-primary inline-flex items-center gap-2 cursor-pointer ${
                isLoading || !apiConfig ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Select PDF File
                </>
              )}
            </label>
          </div>
        </div>
      )}

      {/* ArXiv URL */}
      {activeTab === 'arxiv' && (
        <form onSubmit={handleArxivSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ArXiv URL or ID
            </label>
            <input
              type="text"
              value={arxivUrl}
              onChange={(e) => setArxivUrl(e.target.value)}
              placeholder="https://arxiv.org/abs/2301.00001 or 2301.00001"
              className="input-field"
              disabled={isLoading || !apiConfig}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !arxivUrl || !apiConfig}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Fetching Paper...
              </>
            ) : (
              <>
                <LinkIcon size={18} />
                Fetch Paper
              </>
            )}
          </button>
        </form>
      )}

      {!apiConfig && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
          ⚠️ Please configure your API settings before uploading documents.
        </div>
      )}
    </div>
  );
};
