import React, { useState } from 'react';
import { submitWaitlist } from '../firebase';

interface WaitlistFormProps {
    projectId: string;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ projectId }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');

        const result = await submitWaitlist(email, projectId);

        if (result.success) {
            setStatus('success');
            setMessage('Thanks for joining!');
            setEmail('');
        } else {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        disabled={status === 'loading' || status === 'success'}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${status === 'success'
                                ? 'bg-green-600 text-white cursor-default'
                                : 'bg-purple-600 hover:bg-purple-500 text-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {status === 'loading' ? '...' : status === 'success' ? 'Joined' : 'Join'}
                    </button>
                </div>
                {message && (
                    <p className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default WaitlistForm;
