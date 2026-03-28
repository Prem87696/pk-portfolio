import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 SEND OTP
  const sendOtp = async () => {
    if (!email) return toast.error('Enter email');

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setStep('otp');
      toast.success('OTP sent!');
    }
  };

  // 🔹 VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) return toast.error('Enter OTP');

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Login successful');
      navigate('/dashboard');
    }
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
          : 'Enter OTP'}
      </h1>

      <p className="text-center text-zinc-500 mb-6">
        {step === 'form'
          ? tab === 'login'
            ? 'Login with your email'
            : 'Signup with your details'
          : `OTP sent to ${email}`}
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
        // OTP STEP
        <div className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 rounded-md border text-center text-xl tracking-widest bg-zinc-900"
          />

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-md"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            onClick={sendOtp}
            className="w-full text-sm text-blue-400"
          >
            Resend OTP
          </button>
        </div>
      )}
    </div>
  );
}
