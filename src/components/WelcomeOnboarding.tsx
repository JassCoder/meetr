import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Globe, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Bot, 
  Send, 
  RefreshCw,
  LogIn,
  GraduationCap
} from 'lucide-react';
import { AuthUserState } from '../types';

interface WelcomeOnboardingProps {
  onCompleteAuth: (user: AuthUserState) => void;
  initialUser?: AuthUserState | null;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  inputType?: 'text' | 'email' | 'password' | 'country';
}

const EU_COUNTRIES = [
  { name: 'Germany', flag: '🇩🇪', topUnis: 'TUM Munich, RWTH Aachen', perk: 'Tuition-free public unis' },
  { name: 'Netherlands', flag: '🇳🇱', topUnis: 'TU Delft, Univ of Amsterdam', perk: 'Leading English degrees' },
  { name: 'Sweden', flag: '🇸🇪', topUnis: 'KTH Stockholm, Lund', perk: 'Innovation & tech ecosystem' },
  { name: 'Finland', flag: '🇫🇮', topUnis: 'Aalto University, Helsinki', perk: 'World-class tech labs' },
  { name: 'France', flag: '🇫🇷', topUnis: 'Sorbonne, École Polytechnique', perk: 'Subsidized student housing' },
  { name: 'Ireland', flag: '🇮🇪', topUnis: 'Trinity College Dublin, UCD', perk: '2-year post-study work visa' },
  { name: 'Poland', flag: '🇵🇱', topUnis: 'Warsaw Tech, AGH Krakow', perk: 'Affordable living (€450-€650/mo)' },
  { name: 'Estonia', flag: '🇪🇪', topUnis: 'TalTech, Univ of Tartu', perk: 'Digital unicorn capital' },
  { name: 'All European Union', flag: '🇪🇺', topUnis: 'Bologna Process 180-240 ECTS', perk: 'Pan-EU mobility' },
];

export const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({
  onCompleteAuth,
  initialUser,
}) => {
  const [authMode, setAuthMode] = useState<'chatbot' | 'form'>('chatbot');
  const [formType, setFormType] = useState<'signup' | 'login'>('signup');

  // Form states
  const [name, setName] = useState(initialUser?.name || '');
  const [email, setEmail] = useState(initialUser?.email || '');
  const [password, setPassword] = useState('');
  const [preferredCountry, setPreferredCountry] = useState(initialUser?.preferredCountry || 'Germany');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Chatbot states
  const [chatStep, setChatStep] = useState<number>(1);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "👋 Welcome to Meetr! I'm your European Mobility & Education Advisor.\n\nTo configure your personalized dashboard with verified EU open tertiary data, what is your **Full Name**?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputType: 'text',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotTyping]);

  // Handle Chatbot Step Progress
  const handleSendChatMessage = (overrideText?: string) => {
    const textToSend = (overrideText || chatInput).trim();
    if (!textToSend && chatStep !== 4) return;

    // Add user response message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: chatStep === 3 ? '••••••••' : textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);

      if (chatStep === 1) {
        // Name captured
        setName(textToSend);
        setChatStep(2);
        setChatMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `Wonderful to meet you, **${textToSend}**! 🎓\n\nNext, what is your **Email Address**? We will link your verified European university matches and pathway plans to this account.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            inputType: 'email',
          },
        ]);
      } else if (chatStep === 2) {
        // Email captured
        if (!textToSend.includes('@') || !textToSend.includes('.')) {
          setChatMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: "⚠️ That doesn't look like a valid email address. Please type a valid email (e.g., student@example.com):",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              inputType: 'email',
            },
          ]);
          return;
        }

        setEmail(textToSend);
        setChatStep(3);
        setChatMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `Got it: **${textToSend}** ✅\n\nNow, please choose a **Password** to secure your Meetr account:`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            inputType: 'password',
          },
        ]);
      } else if (chatStep === 3) {
        // Password captured
        if (textToSend.length < 4) {
          setChatMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: '⚠️ Password should be at least 4 characters. Please enter a stronger password:',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              inputType: 'password',
            },
          ]);
          return;
        }

        setPassword(textToSend);
        setChatStep(4);
        setChatMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `Password secured 🔒\n\nLastly, what is your **Preferred European Country** to study or work in? Choose one below or type any European country:`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickReplies: EU_COUNTRIES.map((c) => `${c.flag} ${c.name}`),
            inputType: 'country',
          },
        ]);
      } else if (chatStep === 4) {
        // Country captured
        const cleanedCountry = textToSend.replace(/^[^\w\s]+/, '').trim() || 'Germany';
        setPreferredCountry(cleanedCountry);
        setChatStep(5);

        setChatMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `🎉 **All set, ${name || 'Student'}!**\n\nYour profile has been created:\n• **Name:** ${name}\n• **Email:** ${email}\n• **Preferred Destination:** ${cleanedCountry}\n• **Framework:** EU Directive 2016/801 & Bologna ECTS\n\nClick below to enter the main site and launch your navigation bar!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }, 600);
  };

  const handleFinishOnboarding = () => {
    const finalUser: AuthUserState = {
      name: name.trim() || 'Student Explorer',
      email: email.trim() || 'student@meetr.eu',
      preferredCountry: preferredCountry || 'Germany',
      isLoggedIn: true,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage
    localStorage.setItem('meetr_auth_user', JSON.stringify(finalUser));
    onCompleteAuth(finalUser);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formType === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 4) {
        setErrorMessage('Password must be at least 4 characters.');
        return;
      }

      handleFinishOnboarding();
    } else {
      // Login flow
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter your email.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }

      const finalUser: AuthUserState = {
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        preferredCountry: preferredCountry || 'Germany',
        isLoggedIn: true,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('meetr_auth_user', JSON.stringify(finalUser));
      onCompleteAuth(finalUser);
    }
  };

  const handleQuickDemoLogin = () => {
    const demoUser: AuthUserState = {
      name: 'Jaspreet Saini',
      email: 'sainijaspreet1999@gmail.com',
      preferredCountry: 'Germany',
      isLoggedIn: true,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('meetr_auth_user', JSON.stringify(demoUser));
    onCompleteAuth(demoUser);
  };

  const resetChatbot = () => {
    setChatStep(1);
    setName('');
    setEmail('');
    setPassword('');
    setPreferredCountry('Germany');
    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: "👋 Welcome to Meetr! I'm your European Mobility & Education Advisor.\n\nTo configure your personalized dashboard with verified EU open tertiary data, what is your **Full Name**?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        inputType: 'text',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-black flex flex-col justify-between selection:bg-[#FFE600] selection:text-black">
      {/* Top Banner */}
      <div className="border-b-2 border-black bg-[#FFE600] px-4 py-2.5 text-center text-xs font-mono font-black text-black shadow-sm">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-black animate-ping" />
          ETER REGISTER & BOLOGNA PROCESS ECTS DATA VERIFIED • OFFICIAL EU BENCHMARK
        </span>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Side: Welcome Hero & Trust Pillars */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[#BAE6FD] px-3.5 py-1 text-xs font-mono font-black text-black shadow-[2px_2px_0px_0px_#000]">
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>AI CAREER & HIGHER EDUCATION MOBILITY PORTAL</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black bg-[#FFE600] shadow-[4px_4px_0px_0px_#000]">
                <Compass className="h-8 w-8 text-black stroke-[2.5]" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-black font-display">
                MEETR
              </h1>
            </div>
            <p className="text-xl sm:text-2xl font-black text-black font-display leading-snug">
              Discover realistic European career paths and accredited university degrees.
            </p>
            <p className="text-sm text-zinc-700 leading-relaxed max-w-xl font-medium">
              Complete the quick questionnaire below or chat with our onboard bot to set up your account, choose your preferred destination, and unlock the full interactive dashboard and side navigation bar.
            </p>
          </div>

          {/* Quick Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left pt-2">
            <div className="rounded-xl border-2 border-black bg-white p-4 space-y-1 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center gap-2 text-xs font-black text-black font-display">
                <ShieldCheck className="h-4 w-4 text-black stroke-[2.5]" />
                <span>Zero Hallucinations</span>
              </div>
              <p className="text-[11px] text-zinc-700 font-medium">
                Tuition fees and statutory requirements sourced directly from open national registers.
              </p>
            </div>

            <div className="rounded-xl border-2 border-black bg-white p-4 space-y-1 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center gap-2 text-xs font-black text-black font-display">
                <Globe className="h-4 w-4 text-black stroke-[2.5]" />
                <span>8+ EU Destinations</span>
              </div>
              <p className="text-[11px] text-zinc-700 font-medium">
                Compare Germany, Netherlands, Sweden, Finland, France, Ireland, Poland, and Estonia.
              </p>
            </div>
          </div>

          {/* Quick Demo Login Option */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <button
              onClick={handleQuickDemoLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FFE600] hover:bg-yellow-300 px-5 py-3 text-xs font-black text-black transition-all shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <User className="h-4 w-4 stroke-[2.5]" />
              <span>Instant Demo Login (Jaspreet Saini)</span>
            </button>
            <span className="text-xs font-mono font-bold text-zinc-700">or complete onboarding below ➔</span>
          </div>
        </div>

        {/* Right Side: Onboarding Card (Chatbot or Direct Form) */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="rounded-2xl border-2 border-black bg-white shadow-[8px_8px_0px_0px_#000] overflow-hidden text-black">
            {/* Header Switcher */}
            <div className="flex border-b-2 border-black bg-[#FAF7F0] p-2 gap-2">
              <button
                type="button"
                onClick={() => setAuthMode('chatbot')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-black transition-all ${
                  authMode === 'chatbot'
                    ? 'border-2 border-black bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'border-2 border-transparent text-zinc-700 hover:border-black hover:bg-white'
                }`}
              >
                <Bot className="h-4 w-4 stroke-[2.5]" />
                <span>Onboarding Bot</span>
                <span className="rounded bg-white border border-black px-1.5 py-0.2 text-[9px] font-mono font-black">AI</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('form')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-black transition-all ${
                  authMode === 'form'
                    ? 'border-2 border-black bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'border-2 border-transparent text-zinc-700 hover:border-black hover:bg-white'
                }`}
              >
                <GraduationCap className="h-4 w-4 stroke-[2.5]" />
                <span>Questionnaire</span>
              </button>
            </div>

            {/* CHATBOT MODE */}
            {authMode === 'chatbot' ? (
              <div className="flex flex-col h-[490px]">
                {/* Chatbot Top Status Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-black bg-[#FAF7F0] text-xs">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-black bg-[#BAE6FD] text-black">
                        <Bot className="h-4 w-4 stroke-[2.5]" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-black" />
                    </div>
                    <div>
                      <span className="font-black text-black text-xs font-display">Meetr Onboard Assistant</span>
                      <span className="block text-[10px] text-zinc-600 font-mono font-bold">Step {Math.min(chatStep, 4)} of 4: Profile Setup</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetChatbot}
                    title="Restart conversation"
                    className="flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-700 hover:text-black transition-colors rounded border border-black bg-white px-2 py-0.5 shadow-[1px_1px_0px_0px_#000]"
                  >
                    <RefreshCw className="h-3 w-3 stroke-[2.5]" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Chat Messages Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed bg-[#FAF7F0] no-scrollbar">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl p-3.5 border-2 border-black ${
                          msg.sender === 'user'
                            ? 'bg-[#FFE600] text-black rounded-br-none shadow-[3px_3px_0px_0px_#000] font-bold'
                            : 'bg-white text-black rounded-bl-none shadow-[3px_3px_0px_0px_#000]'
                        }`}
                      >
                        <div className="whitespace-pre-line font-normal">
                          {msg.text.split('**').map((part, i) =>
                            i % 2 === 1 ? <strong key={i} className="font-black text-black">{part}</strong> : part
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono font-bold mt-1 px-1">
                        {msg.timestamp}
                      </span>

                      {/* Quick Country Buttons if present */}
                      {msg.quickReplies && chatStep === 4 && (
                        <div className="mt-2 flex flex-wrap gap-1.5 max-w-full">
                          {msg.quickReplies.map((reply) => (
                            <button
                              key={reply}
                              type="button"
                              onClick={() => handleSendChatMessage(reply)}
                              className="rounded-lg border-2 border-black bg-white hover:bg-[#FFE600] px-2.5 py-1 text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isBotTyping && (
                    <div className="flex items-center gap-1.5 text-xs text-black font-bold py-1">
                      <div className="h-2 w-2 rounded-full bg-black animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-black animate-bounce delay-150" />
                      <div className="h-2 w-2 rounded-full bg-black animate-bounce delay-300" />
                      <span className="text-[10px] ml-1 font-mono">Advisor is typing...</span>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Bottom Input Area or Completion Button */}
                <div className="p-3 border-t-2 border-black bg-white">
                  {chatStep === 5 ? (
                    <button
                      type="button"
                      onClick={handleFinishOnboarding}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FFE600] hover:bg-yellow-300 py-3.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all uppercase font-mono"
                    >
                      <span>Enter Meetr & Open Side Navigation Bar</span>
                      <ArrowRight className="h-4 w-4 stroke-[3]" />
                    </button>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendChatMessage();
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="relative flex-1">
                        <input
                          type={
                            chatStep === 3 && !showPassword
                              ? 'password'
                              : chatStep === 2
                              ? 'email'
                              : 'text'
                          }
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={
                            chatStep === 1
                              ? 'Enter your full name...'
                              : chatStep === 2
                              ? 'Enter your email address...'
                              : chatStep === 3
                              ? 'Choose a secure password...'
                              : 'Select or type preferred country...'
                          }
                          className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] px-3.5 py-2.5 text-xs font-bold text-black placeholder-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:bg-[#FEF9C3] focus:outline-none"
                          autoFocus
                        />
                        {chatStep === 3 && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-black hover:text-zinc-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-[#FFE600] hover:bg-yellow-300 disabled:opacity-50 text-black shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                      >
                        <Send className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              /* DIRECT FORM MODE */
              <div className="p-6 space-y-5 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-black">
                    <button
                      type="button"
                      onClick={() => setFormType('signup')}
                      className={`pb-1 border-b-2 transition-colors ${
                        formType === 'signup'
                          ? 'border-black text-black bg-[#FFE600] px-2 py-0.5 rounded'
                          : 'border-transparent text-zinc-500 hover:text-black'
                      }`}
                    >
                      1. Questionnaire & Sign Up
                    </button>
                    <span className="text-black">•</span>
                    <button
                      type="button"
                      onClick={() => setFormType('login')}
                      className={`pb-1 border-b-2 transition-colors ${
                        formType === 'login'
                          ? 'border-black text-black bg-[#FFE600] px-2 py-0.5 rounded'
                          : 'border-transparent text-zinc-500 hover:text-black'
                      }`}
                    >
                      2. Log In
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="rounded-xl border-2 border-black bg-[#FECDD3] p-3 text-xs text-black font-bold shadow-[2px_2px_0px_0px_#000]">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  {formType === 'signup' && (
                    <div>
                      <label className="block text-xs font-black uppercase text-zinc-700 font-mono mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                          <User className="h-4 w-4 stroke-[2.5]" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Jaspreet Saini"
                          className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] pl-9 pr-3 py-2.5 text-xs text-black font-bold placeholder-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:bg-[#FEF9C3] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black uppercase text-zinc-700 font-mono mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                        <Mail className="h-4 w-4 stroke-[2.5]" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. student@example.com"
                        className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] pl-9 pr-3 py-2.5 text-xs text-black font-bold placeholder-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:bg-[#FEF9C3] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-zinc-700 font-mono mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                        <Lock className="h-4 w-4 stroke-[2.5]" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] pl-9 pr-10 py-2.5 text-xs text-black font-bold placeholder-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:bg-[#FEF9C3] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-black hover:text-zinc-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-zinc-700 font-mono mb-1">
                      Preferred European Country
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                        <Globe className="h-4 w-4 stroke-[2.5]" />
                      </div>
                      <select
                        value={preferredCountry}
                        onChange={(e) => setPreferredCountry(e.target.value)}
                        className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] pl-9 pr-3 py-2.5 text-xs text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:bg-[#FEF9C3] focus:outline-none"
                      >
                        {EU_COUNTRIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.flag} {c.name} ({c.perk})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FFE600] hover:bg-yellow-300 py-3 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all uppercase font-mono"
                  >
                    {formType === 'signup' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                        <span>Complete Questionnaire & Enter Meetr</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 stroke-[3]" />
                        <span>Log In to Meetr</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Footer Note */}
            <div className="border-t-2 border-black bg-[#FAF7F0] px-4 py-2.5 text-center text-[11px] font-mono font-bold text-zinc-700">
              <span>GDPR compliant • Bologna ECTS framework • EU Directive 2016/801</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="border-t-2 border-black bg-white py-4 text-center text-xs font-mono font-black text-black">
        <p>MEETR • European Higher Education & Career Mobility Intelligence</p>
      </footer>
    </div>
  );
};
