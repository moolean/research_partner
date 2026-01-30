/**
 * Chat Interface Component
 */
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { apiService } from '../services/api';

export const ChatInterface: React.FC = () => {
  const {
    currentDocument,
    apiConfig,
    chatMessages,
    addChatMessage,
    isLoading,
  } = useAppStore();

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !apiConfig || !currentDocument) return;

    const userMessage = message.trim();
    setMessage('');
    setIsSending(true);

    // Add user message
    addChatMessage({
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    });

    try {
      const response = await apiService.sendChatMessage(
        currentDocument.document_id,
        userMessage,
        apiConfig
      );

      // Add assistant response
      addChatMessage({
        role: 'assistant',
        content: response.response,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Error sending message:', err);
      addChatMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!currentDocument) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <MessageCircle size={64} className="mx-auto mb-4" />
          <p>Upload a document to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="border-b p-4 bg-gray-50">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle size={20} />
          Chat about "{currentDocument.title}"
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Ask questions about the paper, request clarifications, or explore
          concepts in depth
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p className="mb-4">Start a conversation!</p>
            <div className="text-left max-w-md mx-auto space-y-2">
              <p className="text-sm text-gray-500">Try asking:</p>
              <ul className="text-sm space-y-1">
                <li className="text-gray-600">
                  • "What's the main contribution of this paper?"
                </li>
                <li className="text-gray-600">
                  • "Can you explain the methodology in more detail?"
                </li>
                <li className="text-gray-600">
                  • "What are the limitations of this work?"
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <Loader2 className="animate-spin text-gray-400" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about the paper..."
            className="input-field flex-1"
            disabled={isSending || isLoading || !apiConfig}
          />
          <button
            type="submit"
            disabled={
              !message.trim() || isSending || isLoading || !apiConfig
            }
            className="btn-primary px-6 flex items-center gap-2"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Send size={18} />
                Send
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
