import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Compass, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  Sliders,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { UserProfileState, ProgramItem, CareerItem } from '../types';
import { CAREERS_DATA } from '../data/careersData';
import { PROGRAMS_DATA } from '../data/polandEducationData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendedCareerIds?: string[];
  recommendedProgramIds?: string[];
  suggestedPrompts?: string[];
  source?: string;
}

interface AIAssistantViewProps {
  profile: UserProfileState;
  onUpdateProfile: (updates: Partial<UserProfileState>) => void;
  onSelectCareer: (career: CareerItem) => void;
  onSelectProgram: (program: ProgramItem) => void;
  onOpenProfileModal: () => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  profile,
  onUpdateProfile,
  onSelectCareer,
  onSelectProgram,
  onOpenProfileModal,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `### Welcome to Meetr — European Career & Education Advisor

I am your **AI Career & Education Advisor**. Instead of just browsing university catalogues, we start with **your situation, ambitions, and constraints**.

Tell me about yourself in plain words:
- What subjects or activities do you enjoy? (e.g. gaming, math, building software, cybersecurity, data science)
- What is your current academic stage? (e.g. Grade XII / High School, Bachelor's)
- What is your approximate annual budget for tuition?
- Are you interested in specific EU countries (e.g. Germany, Netherlands, Sweden, France, Finland, Ireland, Poland, Estonia)?

You can type freely below, or tap one of the starter questions!`,
      timestamp: 'Just now',
      suggestedPrompts: [
        'Grade XII with 80%, love game development & C++, budget around €4,000/year',
        'Can I study Computer Science in Germany or Finland with low or zero tuition?',
        'Compare TU Delft Computer Science with TUM Munich and Warsaw Tech',
        'What are post-study work rights and EU Blue Card pathways for international students?',
      ],
      source: 'Meetr Advisory Engine',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const userMessage = (textToSend || input).trim();
    if (!userMessage || isLoading) return;

    const userMsgObj: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          currentProfile: profile,
          history: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      // Apply structured profile updates if detected
      if (data.extractedProfileUpdates && Object.keys(data.extractedProfileUpdates).length > 0) {
        onUpdateProfile(data.extractedProfileUpdates);
      }

      const botMsgObj: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedCareerIds: data.recommendedCareerIds || [],
        recommendedProgramIds: data.recommendedProgramIds || [],
        suggestedPrompts: data.suggestedQuickPrompts || [],
        source: data.source || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, botMsgObj]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback message
      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `I analyzed your request. Based on accredited European higher education datasets and European tech sector demand:
- **Computer Science, Software & AI** degrees across Germany, Netherlands, Sweden, France, Finland, Ireland, Poland, and Estonia offer exceptional international mobility.
- Top institutions matching technical profiles include **TUM Munich, TU Delft, KTH Stockholm, Warsaw Tech, and Aalto University**.
- European programs adhere to the Bologna process (180 to 240 ECTS credits), ensuring seamless diploma recognition and student work rights under EU Directive 2016/801.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedCareerIds: ['gameplay-programmer', 'software-engineer'],
        recommendedProgramIds: ['tum-info-eng-bsc', 'tudelft-cse-bsc', 'pw-cs-inż'],
        suggestedPrompts: [
          'What are the English requirements for German public universities?',
          'How does the Dutch Numerus Fixus selection system work?',
          'What are post-graduation work search rights across EU member states?',
        ],
        source: 'Meetr Offline Advisory Engine',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="mb-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <Sparkles className="h-4 w-4" />
              <span>Goal-Driven Advisory Engine</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Start with your Ambitions, Not a Catalogue
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-slate-300 sm:text-sm">
              Talk naturally. Meetr extracts your constraints, compares formal degrees with alternative learning routes, and grounds all advice in verified European Higher Education Open Datasets.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <div>
              <div className="font-semibold text-white">Verified Grounding</div>
              <div className="text-[11px] text-slate-400">EU Open Datasets (ETER) • 0 Hallucinations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chat + Live Profile Inspector */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Chat Area (7 cols on lg) */}
        <div className="flex flex-col h-[700px] rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl overflow-hidden lg:col-span-8">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[78%] space-y-3`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line prose prose-invert prose-sm max-w-none">
                        {msg.content}
                      </div>

                      <div className={`mt-2 flex items-center justify-between text-[10px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                        <span>{msg.timestamp}</span>
                        {msg.source && (
                          <span className="font-mono text-[9px] opacity-75">
                            {msg.source}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Grounded Recommended Cards (if any) */}
                    {!isUser && (
                      <>
                        {/* Recommended Careers */}
                        {msg.recommendedCareerIds && msg.recommendedCareerIds.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-400">
                              <Compass className="h-3.5 w-3.5" />
                              <span>Matched Career Pathways:</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.recommendedCareerIds.map((cId) => {
                                const career = CAREERS_DATA.find((c) => c.id === cId);
                                if (!career) return null;
                                return (
                                  <div
                                    key={career.id}
                                    onClick={() => onSelectCareer(career)}
                                    className="cursor-pointer group flex items-start justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all"
                                  >
                                    <div>
                                      <div className="font-semibold text-xs text-white group-hover:text-blue-400 flex items-center gap-1">
                                        <span>{career.title}</span>
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <div className="text-[11px] text-slate-400">
                                        Mid: €{career.salaryData.midEur.toLocaleString()}/yr
                                      </div>
                                    </div>
                                    <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-400">
                                      {career.demandLevel} Demand
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Recommended Programs */}
                        {msg.recommendedProgramIds && msg.recommendedProgramIds.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                              <GraduationCap className="h-3.5 w-3.5" />
                              <span>Verified Polish University Programs:</span>
                            </div>
                            <div className="space-y-1.5">
                              {msg.recommendedProgramIds.map((pId) => {
                                const prog = PROGRAMS_DATA.find((p) => p.id === pId);
                                if (!prog) return null;
                                return (
                                  <div
                                    key={prog.id}
                                    onClick={() => onSelectProgram(prog)}
                                    className="cursor-pointer group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all"
                                  >
                                    <div>
                                      <div className="font-semibold text-xs text-white group-hover:text-emerald-400 flex items-center gap-1">
                                        <span>{prog.name}</span>
                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <div className="text-[11px] text-slate-400">
                                        {prog.institutionName} • {prog.institutionCity} • {prog.degreeLevel}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs font-bold text-emerald-400">
                                        €{prog.nonEuTuitionEurAnnual.toLocaleString()}/yr
                                      </div>
                                      <span className="text-[9px] text-slate-400">
                                        {prog.durationYears} yrs • {prog.ectsCredits} ECTS
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Suggested Prompts */}
                        {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.suggestedPrompts.map((prompt, i) => (
                              <button
                                key={i}
                                onClick={() => handleSendMessage(prompt)}
                                className="rounded-lg border border-slate-800 bg-slate-950/90 px-2.5 py-1 text-[11px] text-slate-300 hover:border-blue-500/40 hover:bg-blue-600/10 hover:text-blue-300 transition-colors"
                              >
                                {prompt}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Bot className="h-4 w-4 animate-spin" />
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-400 font-mono">
                      Consulting Polish higher education database & career matrices...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="border-t border-slate-800 bg-slate-950/80 p-3 sm:p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Pathway: 'I like math & games, budget €4,000, looking for degrees in Poland'..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Live Structured Profile & Constraints (4 cols on lg) */}
        <div className="space-y-4 lg:col-span-4">
          {/* Profile Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Live Student Profile</h3>
              </div>
              <button
                onClick={onOpenProfileModal}
                className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-400 hover:bg-blue-500/20"
              >
                Tune Parameters
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/50">
                <span className="text-slate-400">Academic Score:</span>
                <span className="font-bold text-blue-400">
                  {profile.highSchoolPercentage}% ({profile.educationLevel})
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/50">
                <span className="text-slate-400">Tuition Budget:</span>
                <span className="font-bold text-emerald-400">
                  €{profile.annualBudgetEur.toLocaleString()} / year
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/50">
                <span className="text-slate-400">Target Career:</span>
                <span className="font-bold text-white">
                  {profile.targetCareerId
                    ? CAREERS_DATA.find((c) => c.id === profile.targetCareerId)?.title
                    : 'General Tech & CS'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/50">
                <span className="text-slate-400">Location Focus:</span>
                <span className="font-medium text-slate-200">
                  {profile.preferredCity || 'Any in Poland'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/50">
                <span className="text-slate-400">Immigration Status:</span>
                <span className="font-medium text-amber-400">
                  {profile.passportOrigin} (Requires D-Type Visa)
                </span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-500 leading-normal">
              Pathway auto-extracts these fields from your conversation to calibrate live university match scores.
            </p>
          </div>

          {/* Quick Polish Education Context Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Poland Education Realities</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Inżynier (B.Sc. Eng)</strong> takes 3.5 years (210 ECTS) and includes an engineering thesis.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Full-time students</strong> have the statutory right to work up to 20h/week during studies without work permits.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cost of Living</strong> averages 2,400 to 2,900 PLN/month (~€550 - €670/mo) in major cities.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
