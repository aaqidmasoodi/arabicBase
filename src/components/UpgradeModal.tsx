import React from 'react';
import { X, Check, Sparkles, Zap, Shield, Database } from 'lucide-react';
import { useStore } from '../store/useStore';

interface UpgradeModalProps {
    onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose }) => {
    const { user } = useStore();

    const handleUpgrade = async () => {
        // Use the payment link from environment variables
        const stripePaymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;

        if (!stripePaymentLink || stripePaymentLink.includes('...')) {
            alert('Stripe integration pending. Please set VITE_STRIPE_PAYMENT_LINK in your .env file.');
            return;
        }

        // Append client_reference_id to track which user is paying
        // Stripe Payment Links support client_reference_id as a query param
        window.location.href = `${stripePaymentLink}?client_reference_id=${user?.id}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>

                {/* Left Side - Visual */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-6">
                            <Sparkles size={14} />
                            <span>Pro Membership</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Unlock Your Full Potential</h2>
                        <p className="text-emerald-100 leading-relaxed">
                            Take your Arabic learning journey to the next level with unlimited access and premium features.
                        </p>
                    </div>

                    <div className="relative z-10 mt-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Database size={20} />
                            </div>
                            <div>
                                <div className="font-semibold">Unlimited Entries</div>
                                <div className="text-sm text-emerald-200">No more 100-word limit</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Zap size={20} />
                            </div>
                            <div>
                                <div className="font-semibold">Priority AI Insights</div>
                                <div className="text-sm text-emerald-200">Faster, deeper analysis</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Pricing & Comparison */}
                <div className="w-full md:w-3/5 p-8 md:p-10 bg-white dark:bg-gray-900">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Plan</h3>
                        <p className="text-gray-500 dark:text-gray-400">Simple pricing, no hidden fees.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* Free Plan */}
                        <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Free</div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$0</div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <Check size={16} className="text-emerald-500" />
                                    <span>100 Entries Limit</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <Check size={16} className="text-emerald-500" />
                                    <span>Basic AI Insights</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <Check size={16} className="text-emerald-500" />
                                    <span>Community Access</span>
                                </li>
                            </ul>
                        </div>

                        {/* Pro Plan */}
                        <div className="relative p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                                Most Popular
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Pro Lifetime</div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">$19</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">/once</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium">
                                    <div className="p-0.5 rounded-full bg-emerald-500 text-white">
                                        <Check size={12} />
                                    </div>
                                    <span>Unlimited Entries</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium">
                                    <div className="p-0.5 rounded-full bg-emerald-500 text-white">
                                        <Check size={12} />
                                    </div>
                                    <span>Advanced AI Features</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium">
                                    <div className="p-0.5 rounded-full bg-emerald-500 text-white">
                                        <Check size={12} />
                                    </div>
                                    <span>Priority Support</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleUpgrade}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Get Lifetime Access</span>
                        <Shield size={20} />
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Secure payment via Stripe. 30-day money-back guarantee.
                    </p>
                </div>
            </div>
        </div>
    );
};
