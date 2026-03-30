import React, { useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(Array(8).fill(''));
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // 🔹 SEND CODE
  const sendOtp = async () => {
    if (!email || !email.includes('@')) {
      return toast.error('Enter valid email');
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setStep('otp');
      toast.success('Code sent!');
    }
  };

  // 🔹 VERIFY CODE
  const verifyOtp = async () => {
    const finalOtp = otp.join('');

    if (finalOtp.length !== 8) {
      return toast.error('Enter valid 8 digit code');
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: finalOtp,
      type: 'email',
    });

    setLoading(false);

    if (error) {
      toast.error('Invalid code');
    } else {
      toast.success('Login successful');
      navigate('/dashboard');
    }
  };

  // 🔹 INPUT CHANGE
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // 🔹 BACKSPACE
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && inputsRef.current[index - 1]) {
        inputsRef.current[index - 1]?.focus();
      }

      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // 🔹 PASTE SUPPORT
  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (!paste) return;

    const newOtp = paste.split('');
    setOtp([...newOtp, ...Array(8 - newOtp.length).fill('')]);

    newOtp.forEach((_, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = newOtp[i];
      }
    });
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">

      {/* Tabs */}
      <div className="flex mb-6 bg-zinc-800 rounded-lg p-1">
        <button
          onClick={() => { setTab('login'); setStep('form'); }}
          className={`flex-1 py-2 rounded-md ${tab === 'login' ? 'bg-white text-black' : 'text-white'}`}
        >
          Login
        </button>
        <button
          onClick={() => { setTab('signup'); setStep('form'); }}
          className={`flex-1 py-2 rounded-md ${tab === 'signup' ? 'bg-white text-black' : 'text-white'}`}
        >
          Signup
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2 text-center">
        {step === 'form'
          ? tab === 'login'
            ? 'Welcome Back'
            : 'Create Account'
          : 'Enter Code'}
      </h1>

      <p className="text-center text-zinc-500 mb-6">
        {step === 'form'
          ? tab === 'login'
            ? 'Login with your email'
            : 'Signup with your details'
          : `Code sent to ${email}`}
      </p>

      {/* FORM */}
      {step === 'form' ? (
        <div className="space-y-4">
          {tab === 'signup' && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-md border bg-zinc-900"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border bg-zinc-900"
          />

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-md"
          >
            {loading ? 'Sending...' : 'Continue'}
          </button>
        </div>
      ) : (
        // 🔥 PRO OTP UI
        <div className="space-y-6">

          <div
            className="flex justify-center gap-2"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-10 h-12 text-center text-xl rounded-md bg-zinc-900 border border-zinc-700 focus:border-white outline-none"
              />
            ))}
          </div>

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-md"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <button
            onClick={sendOtp}
            className="w-full text-sm text-blue-400"
          >
            Resend Code
          </button>

        </div>
      )}
    </div>
  );
}
