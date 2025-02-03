import React, { useState } from 'react';
import { Sparkles, Bug, Lightbulb, Code, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import CodeBlock from './codeBlock';

interface Error {
  title: string;
  line: string;
  code: string;
  fixedCode: string;
  description: string;
}

interface Suggestion {
  title: string;
  code: string;
  explanation: string;
}

interface Practice {
  title: string;
  code: string;
  explanation: string;
}

interface AIResponse {
  errors: Error[];
  suggestions: Suggestion[];
  bestPractices: Practice[];
  timestamp: string;
}

interface AISuggestionsSidebarProps {
  isOpen: boolean;
  aiResponse?: AIResponse;
  isLoading: boolean;
  error?: string | null;
}

interface SectionProps {
  title: string;
  icon: React.ElementType;
  type: 'error' | 'suggestion' | 'practice';
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

interface ExpandedSections {
  errors: boolean;
  suggestions: boolean;
  practices: boolean;
}

const AISuggestionsSidebar: React.FC<AISuggestionsSidebarProps> = ({ 
  isOpen, 
  aiResponse, 
  isLoading,
  error 
}) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    errors: true,
    suggestions: true,
    practices: true
  });

  const toggleSection = (section: keyof ExpandedSections): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen) return null;

  const Section: React.FC<SectionProps> = ({ 
    title, 
    icon: Icon, 
    type, 
    children, 
    isExpanded, 
    onToggle 
  }) => (
    <div className="mb-4 bg-zinc-800/50 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full p-3 flex items-center justify-between text-left
          ${type === 'error' ? 'bg-red-900/20' : ''}
          ${type === 'suggestion' ? 'bg-blue-900/20' : ''}
          ${type === 'practice' ? 'bg-emerald-900/20' : ''}`}
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 
            ${type === 'error' ? 'text-red-400' : ''}
            ${type === 'suggestion' ? 'text-blue-400' : ''}
            ${type === 'practice' ? 'text-emerald-400' : ''}`} 
          />
          <span className="font-medium text-zinc-100">{title}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isExpanded && (
        <div className="p-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full md:w-[20rem] lg:w-[25rem] h-screen bg-zinc-900 border-l border-zinc-800 overflow-y-auto transition-all duration-300">
      <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="flex items-center gap-2 text-yellow-400">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-semibold">AI Code Analysis</h2>
        </div>
      </div>

      <div className="p-4 max-w-full">
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-3 text-red-400">
            <Bug className="w-8 h-8" />
            <p>{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400">Analyzing your code...</p>
          </div>
        ) : aiResponse ? (
          <div className="space-y-6">
            {aiResponse.errors.length > 0 && (
              <Section
                title={`Issues Found (${aiResponse.errors.length})`}
                icon={Bug}
                type="error"
                isExpanded={expandedSections.errors}
                onToggle={() => toggleSection('errors')}
              >
                {aiResponse.errors.map((error, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-red-400 font-medium">{error.title}</h4>
                    <p className="text-sm text-zinc-400">Line: {error.line}</p>
                    <div className="space-y-1">
                      <p className="text-sm text-zinc-300">{error.description}</p>
                      <div className="bg-red-900/20 p-2 rounded">
                        <p className="text-sm text-red-400 font-mono">{error.code}</p>
                      </div>
                      <div className="bg-emerald-900/20 p-2 rounded">
                        <p className="text-sm text-emerald-400 font-mono">{error.fixedCode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {aiResponse.suggestions.length > 0 && (
              <Section
                title={`Suggestions (${aiResponse.suggestions.length})`}
                icon={Lightbulb}
                type="suggestion"
                isExpanded={expandedSections.suggestions}
                onToggle={() => toggleSection('suggestions')}
              >
                {aiResponse.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-blue-400 font-medium">{suggestion.title}</h4>
                    <CodeBlock code={suggestion.code} />
                    <p className="text-sm text-zinc-300">{suggestion.explanation}</p>
                  </div>
                ))}
              </Section>
            )}

            {aiResponse.bestPractices.length > 0 && (
              <Section
                title={`Best Practices (${aiResponse.bestPractices.length})`}
                icon={CheckCircle}
                type="practice"
                isExpanded={expandedSections.practices}
                onToggle={() => toggleSection('practices')}
              >
                {aiResponse.bestPractices.map((practice, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-emerald-400 font-medium">{practice.title}</h4>
                    <CodeBlock code={practice.code} />
                    <p className="text-sm text-zinc-300">{practice.explanation}</p>
                  </div>
                ))}
              </Section>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 space-y-3 text-zinc-400">
            <Code className="w-8 h-8" />
            <p>Start coding to get AI-powered suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsSidebar;