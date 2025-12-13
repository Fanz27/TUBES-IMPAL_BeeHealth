import { useState, useRef, useEffect } from 'react';

export default function GeminiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      console.log('=== DEBUG START ===');
      console.log('API Key exists:', !!apiKey);
      console.log('API Key length:', apiKey?.length);
      console.log('Current input:', currentInput);
      console.log('Messages history:', messages);
      
      if (!apiKey) {
        throw new Error('API key tidak ditemukan. Pastikan sudah diset di file .env');
      }

      const requestBody = {
        contents: messages.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })).concat([{ role: 'user', parts: [{ text: currentInput }] }]),
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
      console.log('Fetching URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }
      
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Error in response';
      console.log('Reply text:', reply);
      console.log('=== DEBUG END ===');

      const geminiMessage = { sender: 'gemini', text: reply };
      setMessages((prev) => [...prev, geminiMessage]);
    } catch (error) {
      console.error('=== ERROR CAUGHT ===');
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      console.error('=== ERROR END ===');
      
      const errorMessage = { sender: 'gemini', text: `Error: ${error.message || 'Terjadi kesalahan saat menghubungi API'}` };
      setMessages((prev) => [...prev, errorMessage]);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Gemini Chat Bot
        </h3>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 relative group ${
                    msg.sender === 'user'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <button
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-20 rounded p-1"
                    onClick={() => navigator.clipboard.writeText(msg.text)}
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
            <div ref={chatEndRef}>
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg p-3 text-gray-600">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}