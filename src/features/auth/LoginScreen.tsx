
import React from 'react';
import { LoginForm } from './components/LoginForm';
import { LoginHeader } from './components/LoginHeader';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#006DFF] font-sans p-4">

      {/* Main Card Container */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-10 flex flex-col items-center">

          <LoginHeader />
          <LoginForm onLogin={onLoginSuccess} />

        </div>
      </div>

      {/* 5. Copyright */}
      <div className="mt-8 text-center text-white/80 text-xs">
        <p>© 2025 CEH Contract Manager. All rights reserved.</p>
      </div>

    </div>
  );
};
