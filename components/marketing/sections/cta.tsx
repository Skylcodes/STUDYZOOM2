'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, CornerDownRight, RefreshCw, Rocket } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Pre-generated star positions to ensure consistency between server and client
const staticStars = Array(50).fill(null).map((_, i) => ({
    id: i,
    // Empty values initially - will be populated client-side
    top: 0,
    left: 0,
    opacity: 0,
    delay: 0
}));

export function CTA(): React.JSX.Element {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [stars, setStars] = useState(staticStars);
    const [isClient, setIsClient] = useState(false);

    // Generate random star positions only on the client side after component mounts
    useEffect(() => {
        const randomizedStars = staticStars.map((star) => ({
            ...star,
            top: Math.random() * 100,
            left: Math.random() * 100,
            opacity: Math.random() * 0.7 + 0.3,
            delay: Math.random() * 10
        }));

        setStars(randomizedStars);
        setIsClient(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            // In a real implementation, you would integrate with your email service
        }, 1500);
    };

    return (
        <section className="w-full py-20 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-indigo-950/20 to-blue-950/20"></div>
            <div className="absolute left-1/4 -top-48 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute right-1/3 -bottom-32 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl opacity-50"></div>

            {/* Stars effect (small dots) - Only rendered on client side */}
            <div className="absolute inset-0 overflow-hidden">
                {isClient && stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse-slow"
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            opacity: star.opacity,
                            animationDelay: `${star.delay}s`
                        }}
                    />
                ))}
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium">
                                <Rocket className="h-3.5 w-3.5 mr-2" />
                                Ready for takeoff
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
                                Start Building Your <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">$50K MRR</span> SaaS Today
                            </h2>

                            <p className="text-gray-300 text-lg max-w-md">
                                Join thousands of founders who trusted our enterprise-grade SaaS boilerplate to build profitable businesses fast.
                            </p>

                            <div className="space-y-3">
                                {[
                                    'Save hundreds of development hours',
                                    'Launch your MVP in days, not months',
                                    'Built to scale to 20,000+ concurrent users',
                                    'Enterprise-ready security and performance'
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.1 * index }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-200">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-8">
                                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full border-gray-700 bg-black/50 hover:bg-black/80 text-white">
                                    View Documentation
                                </Button>
                            </div>
                        </motion.div>

                        {/* Right content - Email signup */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur opacity-30"></div>
                            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl">
                                {/* Background pattern */}
                                <div className="absolute inset-0 bg-space-pattern opacity-20"></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 rounded-xl bg-black/50 border border-white/10">
                                            <CornerDownRight className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Join the Waitlist</h3>
                                    </div>

                                    <p className="text-gray-300 mb-6">
                                        Get early access, exclusive discounts and development tips when you join our waitlist.
                                    </p>

                                    {isSubmitted ? (
                                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                                            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                            <h4 className="text-lg font-medium text-white mb-1">You're on the list!</h4>
                                            <p className="text-gray-300">
                                                We'll send you access instructions soon. Check your inbox!
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                                                    Email address
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className={cn(
                                                        "bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-2 focus:ring-indigo-500/50",
                                                        error ? "border-red-500" : ""
                                                    )}
                                                />
                                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium shadow-lg"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        Join Now <ArrowRight className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}

                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <p className="text-sm text-gray-400 text-center">
                                            "This boilerplate saved us 3 months of development time and helped us reach profitability in record time."
                                        </p>
                                        <div className="flex items-center justify-center mt-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                                                JD
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-white">Jason Doe</p>
                                                <p className="text-xs text-gray-500">Founder, ScaleTech</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
