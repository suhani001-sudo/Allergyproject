import { useState, useEffect } from 'react';

/**
 * AI Assistant Component
 * Provides AI-powered allergy analysis and chat functionality
 */
const AIAssistant = () => {
  const [aiStatus, setAiStatus] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');

  // Get auth token from localStorage or your auth context
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Check AI service status on mount
  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ai/status', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const data = await response.json();
      setAiStatus(data.data);
    } catch (error) {
      console.error('Error checking AI status:', error);
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      alert('Please enter symptoms');
      return;
    }

    setLoading(true);
    try {
      const symptomsList = symptoms.split(',').map(s => s.trim());
      
      const response = await fetch('http://localhost:5000/api/ai/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          symptoms: symptomsList
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.data);
      } else {
        alert(data.message || 'Failed to analyze symptoms');
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      alert('Failed to analyze symptoms');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) {
      return;
    }

    setLoading(true);
    const userMessage = chatMessage;
    setChatMessage('');

    // Add user message to history
    setChatHistory(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Add AI response to history
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date()
        }]);
      } else {
        alert(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!aiStatus) {
    return <div className="ai-assistant loading">Loading AI Assistant...</div>;
  }

  if (!aiStatus.configured) {
    return (
      <div className="ai-assistant not-configured">
        <h2>AI Assistant Not Configured</h2>
        <p>Please configure AI service in the backend to use this feature.</p>
        <p>Add ANTHROPIC_API_KEY or OPENAI_API_KEY to your .env file.</p>
      </div>
    );
  }

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h2>🤖 AI Assistant</h2>
        <div className="ai-status">
          <span className="status-indicator active"></span>
          <span>Provider: {aiStatus.defaultProvider}</span>
        </div>
      </div>

      <div className="ai-tabs">
        <button
          className={activeTab === 'analyze' ? 'active' : ''}
          onClick={() => setActiveTab('analyze')}
        >
          Analyze Symptoms
        </button>
        <button
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
      </div>

      {activeTab === 'analyze' && (
        <div className="analyze-tab">
          <div className="input-section">
            <label>Enter your symptoms (comma-separated):</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., sneezing, itchy eyes, runny nose"
              rows={4}
            />
            <button
              onClick={analyzeSymptoms}
              disabled={loading}
              className="analyze-button"
            >
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </div>

          {analysis && (
            <div className="analysis-results">
              <h3>Analysis Results</h3>
              
              {analysis.possibleAllergens && (
                <div className="result-section">
                  <h4>Possible Allergens:</h4>
                  <ul>
                    {analysis.possibleAllergens.map((allergen, idx) => (
                      <li key={idx}>{allergen}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.severity && (
                <div className="result-section">
                  <h4>Severity:</h4>
                  <span className={`severity ${analysis.severity}`}>
                    {analysis.severity}
                  </span>
                </div>
              )}

              {analysis.immediateActions && (
                <div className="result-section">
                  <h4>Immediate Actions:</h4>
                  <ul>
                    {analysis.immediateActions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.emergencyWarning && (
                <div className="result-section warning">
                  <h4>⚠️ Emergency Warning:</h4>
                  <p>{analysis.emergencyWarning}</p>
                </div>
              )}

              {analysis.rawResponse && (
                <div className="result-section">
                  <h4>AI Response:</h4>
                  <p>{analysis.rawResponse}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="chat-tab">
          <div className="chat-history">
            {chatHistory.length === 0 ? (
              <div className="chat-empty">
                <p>Start a conversation with the AI assistant!</p>
                <p>Ask questions about allergies, symptoms, or treatments.</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  <div className="message-header">
                    <strong>{msg.role === 'user' ? 'You' : 'AI Assistant'}</strong>
                    <span className="timestamp">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))
            )}
          </div>

          <div className="chat-input">
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendChatMessage();
                }
              }}
              placeholder="Ask me anything about allergies..."
              rows={3}
            />
            <button
              onClick={sendChatMessage}
              disabled={loading}
              className="send-button"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .ai-assistant {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .ai-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        .ai-header h2 {
          margin: 0;
          color: #333;
        }

        .ai-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }

        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ccc;
        }

        .status-indicator.active {
          background: #4caf50;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .ai-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .ai-tabs button {
          flex: 1;
          padding: 12px;
          border: none;
          background: #f5f5f5;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s;
        }

        .ai-tabs button:hover {
          background: #e0e0e0;
        }

        .ai-tabs button.active {
          background: #2196f3;
          color: white;
        }

        .input-section {
          margin-bottom: 20px;
        }

        .input-section label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }

        textarea:focus {
          outline: none;
          border-color: #2196f3;
        }

        .analyze-button, .send-button {
          width: 100%;
          padding: 12px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s;
          margin-top: 10px;
        }

        .analyze-button:hover, .send-button:hover {
          background: #1976d2;
        }

        .analyze-button:disabled, .send-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .analysis-results {
          margin-top: 20px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .analysis-results h3 {
          margin-top: 0;
          color: #333;
        }

        .result-section {
          margin: 15px 0;
          padding: 15px;
          background: white;
          border-radius: 8px;
        }

        .result-section h4 {
          margin-top: 0;
          color: #555;
        }

        .result-section ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .result-section.warning {
          background: #fff3cd;
          border-left: 4px solid #ff9800;
        }

        .severity {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .severity.mild {
          background: #c8e6c9;
          color: #2e7d32;
        }

        .severity.moderate {
          background: #fff9c4;
          color: #f57f17;
        }

        .severity.severe {
          background: #ffcdd2;
          color: #c62828;
        }

        .chat-history {
          height: 400px;
          overflow-y: auto;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .chat-empty {
          text-align: center;
          padding: 40px 20px;
          color: #999;
        }

        .chat-message {
          margin-bottom: 15px;
          padding: 12px;
          border-radius: 8px;
        }

        .chat-message.user {
          background: #e3f2fd;
          margin-left: 40px;
        }

        .chat-message.assistant {
          background: white;
          margin-right: 40px;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .message-header strong {
          color: #333;
        }

        .timestamp {
          color: #999;
          font-size: 12px;
        }

        .message-content {
          color: #555;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .not-configured {
          text-align: center;
          padding: 40px;
          background: #fff3cd;
          border-radius: 12px;
        }

        .not-configured h2 {
          color: #856404;
        }

        .not-configured p {
          color: #856404;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
