import React, { useState, useCallback } from 'react';
import { TOPICS } from './constants';
import { generateScript } from './services/geminiService';
import ScriptDisplay from './components/ScriptDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { MailIcon } from './components/icons/MailIcon';
import { UserIcon } from './components/icons/UserIcon';
import { RefreshIcon } from './components/icons/RefreshIcon';

type AppState = 'initial' | 'topic_selected' | 'generating' | 'script_generated';

export default function App() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [topic, setTopic] = useState<string>('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [script, setScript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handlePickTopic = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * TOPICS.length);
    setTopic(TOPICS[randomIndex]);
    setScript('');
    setError(null);
    setPartnerEmail(''); // Reset email when a new topic is picked
    setAppState('topic_selected');
  }, []);

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    setAppState('generating');
    setError(null);
    try {
      const generatedScript = await generateScript(topic);
      setScript(generatedScript);
      setAppState('script_generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState('topic_selected');
    }
  };
  
  const createMailtoLink = (email: string, subject: string, body: string) => {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const renderContent = () => {
    switch (appState) {
      case 'initial':
        return (
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">Ready to connect on a deeper level?</h2>
            <button
              onClick={handlePickTopic}
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto"
            >
              <SparklesIcon className="w-6 h-6 mr-3" />
              Find a Topic to Discuss
            </button>
          </div>
        );
      
      case 'topic_selected':
      case 'generating':
        return (
          <>
            <div className="mb-8">
              <label htmlFor="topic-input" className="block text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2 text-center">
                Your Topic (edit or enter your own)
              </label>
              <textarea
                id="topic-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={appState === 'generating'}
                placeholder="Enter a conversation topic here..."
                className="w-full p-4 bg-white border-2 border-indigo-200 rounded-2xl shadow-sm text-xl md:text-xl text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                rows={3}
              />
            </div>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePickTopic}
                disabled={appState === 'generating'}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                <RefreshIcon className="w-5 h-5 mr-2" />
                New Random Topic
              </button>
              <button
                onClick={handleGenerateScript}
                disabled={appState === 'generating' || !topic.trim()}
                className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {appState === 'generating' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Generate Script
                  </>
                )}
              </button>
            </div>
          </>
        );

      case 'script_generated': {
        const websiteUrl = "https://couples-conversation-starter-509696992737.us-west1.run.app/";
        const emailBody = `${script}\n\n---\n\nCreate your own practice conversation at Conversation Connect:\n${websiteUrl}`;
        
        return (
          <>
            <div className="text-center mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
               <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-1">Your Topic</h3>
              <p className="text-left text-xl font-bold text-gray-800">{topic}</p>
            </div>

            <ScriptDisplay script={script} />

            <div className="mt-8 border-t pt-6 space-y-4">
              <div className="space-y-2">
                <p className="text-center text-gray-600">Enter your partner's email to send them the practice script.</p>
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="Your Partner's Email"
                    className="w-full pl-12 pr-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

               <p className="text-center text-gray-600">This will open a message in your default email app, ready to send.</p>
               <div className="flex">
                <a
                  href={partnerEmail ? createMailtoLink(partnerEmail, `Conversation Practice: ${topic}`, emailBody) : '#'}
                  onClick={(e) => !partnerEmail && e.preventDefault()}
                  className={`w-full text-center px-6 py-3 font-bold rounded-lg transition-colors duration-300 flex items-center justify-center ${
                    partnerEmail
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <MailIcon className="w-5 h-5 mr-2" />
                  Email Script to Partner
                </a>
              </div>
              <button
                onClick={handlePickTopic}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300 mt-4 flex items-center justify-center"
              >
                 <RefreshIcon className="w-5 h-5 mr-2" />
                Try a Different Topic
              </button>
            </div>
          </>
        );
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            <span className="text-indigo-600">Conversation</span> Connect
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Practice meaningful communication with AI-guided scripts using the speaker-listener technique.
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-500">
          {renderContent()}
        </main>

        <footer className="text-center mt-8 text-sm text-gray-500">
            <p>Powered by AI. Designed for connection.</p>
        </footer>
      </div>
    </div>
  );
}