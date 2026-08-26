import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setProcessing(true);

        router.post('/login', { email, password }, {
            onFinish: () => setProcessing(false),
            onError: (errors) => {
                setError(errors.email || 'Email atau password salah.');
            },
        });
    }

    function handleOpenChange(value: boolean) {
        if (!value) {
            setEmail('');
            setPassword('');
            setError('');
        }
        onOpenChange(value);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="border-yellow-100/40 bg-yellow-50/80 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/90">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold text-neutral-800 dark:text-neutral-200">
                        Masuk ke Akun
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                        Masukkan email dan password Anda
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="modal-email" className="text-neutral-700 dark:text-neutral-300">
                            Email
                        </Label>
                        <Input
                            id="modal-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            required
                            autoFocus
                            className="border-yellow-100/40 bg-white/50 focus:border-orange-400 focus:ring-orange-400 dark:border-neutral-700/40 dark:bg-neutral-700/30 dark:text-neutral-300"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="modal-password" className="text-neutral-700 dark:text-neutral-300">
                            Password
                        </Label>
                        <Input
                            id="modal-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="border-yellow-100/40 bg-white/50 focus:border-orange-400 focus:ring-orange-400 dark:border-neutral-700/40 dark:bg-neutral-700/30 dark:text-neutral-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-2 inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-orange-400 px-4 py-3 text-sm font-bold text-neutral-50 ring-zinc-500 transition duration-300 hover:bg-orange-500 focus-visible:ring-3 outline-hidden dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:outline-hidden dark:ring-zinc-200 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {processing && <Spinner />}
                        Masuk
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
