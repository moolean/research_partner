/**
 * Configuration Panel Component
 */
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const ConfigPanel: React.FC = () => {
  const { apiConfig, setApiConfig } = useAppStore();
  const [isOpen, setIsOpen] = useState(!apiConfig);
  const [formData, setFormData] = useState({
    api_key: apiConfig?.api_key || '',
    api_base: apiConfig?.api_base || 'https://api.openai.com/v1',
    model: apiConfig?.model || 'gpt-4-turbo-preview',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.api_key) {
      setApiConfig(formData);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <Settings size={20} />
        <span>API Configuration</span>
        {apiConfig && <span className="text-green-600 text-sm">✓</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-6 z-50">
          <h3 className="text-lg font-semibold mb-4">OpenAI API Configuration</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key *
              </label>
              <input
                type="password"
                value={formData.api_key}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                className="input-field"
                placeholder="sk-..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Base URL
              </label>
              <input
                type="url"
                value={formData.api_base}
                onChange={(e) => setFormData({ ...formData, api_base: e.target.value })}
                className="input-field"
                placeholder="https://api.openai.com/v1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="input-field"
              >
                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                Save Configuration
              </button>
              {apiConfig && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
