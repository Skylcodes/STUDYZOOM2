'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon, KeyIcon, CreditCardIcon, LayoutIcon, UsersIcon, BarChartIcon, ShieldIcon, LockIcon, SparklesIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Feature data with icons and conversion-focused messaging
const featuresData = [
    {
        icon: <KeyIcon className="h-5 w-5 text-indigo-400" />,
        title: 'Frictionless Onboarding',
        description: 'Convert more visitors with multi-provider auth that reduces signup abandonment by up to 34%',
        color: 'from-indigo-600 to-blue-600',
        bgColor: 'bg-indigo-600/10',
        borderColor: 'border-indigo-600/20',
        hoverColor: 'group-hover:bg-indigo-600/20'
    },
    {
        icon: <CreditCardIcon className="h-5 w-5 text-green-400" />,
        title: 'Revenue On Day One',
        description: 'Start collecting payments immediately with our pre-built Stripe subscription system',
        color: 'from-green-600 to-teal-600',
        bgColor: 'bg-green-600/10',
        borderColor: 'border-green-600/20',
        hoverColor: 'group-hover:bg-green-600/20'
    },
    {
        icon: <LayoutIcon className="h-5 w-5 text-blue-400" />,
        title: 'Conversion-Optimized UI',
        description: 'Pre-built components designed to guide users through your conversion funnel',
        color: 'from-blue-600 to-cyan-600',
        bgColor: 'bg-blue-600/10',
        borderColor: 'border-blue-600/20',
        hoverColor: 'group-hover:bg-blue-600/20'
    },
    {
        icon: <UsersIcon className="h-5 w-5 text-purple-400" />,
        title: 'Team Collaboration',
        description: 'Scale to larger clients with team permissions that drive higher-tier subscriptions',
        color: 'from-purple-600 to-pink-600',
        bgColor: 'bg-purple-600/10',
        borderColor: 'border-purple-600/20',
        hoverColor: 'group-hover:bg-purple-600/20'
    },
    {
        icon: <BarChartIcon className="h-5 w-5 text-amber-400" />,
        title: 'Conversion Intelligence',
        description: 'Built-in analytics that reveal exactly where to optimize for maximum revenue',
        color: 'from-amber-600 to-orange-600',
        bgColor: 'bg-amber-600/10',
        borderColor: 'border-amber-600/20',
        hoverColor: 'group-hover:bg-amber-600/20'
    },
    {
        icon: <ShieldIcon className="h-5 w-5 text-rose-400" />,
        title: 'Enterprise Security',
        description: 'Robust security features that build trust and reduce enterprise sales cycles',
        color: 'from-rose-600 to-red-600',
        bgColor: 'bg-rose-600/10',
        borderColor: 'border-rose-600/20',
        hoverColor: 'group-hover:bg-rose-600/20'
    },
];

// Animated feature card with hover effects
const FeatureCard = ({ feature, index }: { feature: typeof featuresData[0], index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            className="group relative"
        >
            <div className={cn(
                "relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl",
                "bg-black/20 border-white/10 hover:bg-black/30"
            )}>
                {/* Gradient top-right corner accent */}
                <div className={cn(
                    "absolute top-0 right-0 h-16 w-16 rounded-bl-3xl rounded-tr-xl bg-gradient-to-br opacity-20 transition-opacity duration-300",
                    `${feature.color}`,
                    "group-hover:opacity-30"
                )}></div>

                {/* Icon with glowing effect */}
                <div className={cn(
                    "mb-4 p-3 rounded-lg inline-flex transition-all duration-300",
                    feature.bgColor,
                    feature.borderColor,
                    feature.hoverColor
                )}>
                    {feature.icon}
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300"
                        style={{ background: `linear-gradient(to right, ${feature.color.replace('from-', '').replace('to-', '')})`, opacity: 0 }}></div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>

                {/* Animating arrow on hover */}
                <div className="mt-4 flex items-center text-blue-400 font-medium transition-all duration-300 opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-1">
                    <span className="mr-1">Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                </div>
            </div>
        </motion.div>
    );
};

// Pulse animation for the floating elements
const pulseAnimation = {
    initial: { scale: 0.96, opacity: 0.8 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse' as const,
            ease: 'easeInOut'
        }
    }
};

export function RevenueUI(): React.JSX.Element {
    return (
        <section className="w-full py-20 relative overflow-hidden">
            {/* Background glow effects - keeping these from the original */}
            <div className="absolute right-1/4 -top-48 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute left-1/3 -bottom-32 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <Badge className="w-fit bg-black/30 text-blue-400 hover:bg-black/50 border-blue-600/30 backdrop-blur-md px-4 py-1 rounded-full mb-4">
                            Revenue-Driving Features
                        </Badge>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent mb-4"
                    >
                        Features That Drive Conversions
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-400 md:text-lg max-w-3xl mx-auto mb-6"
                    >
                        Turn your SaaS idea into a high-converting money machine with these built-in conversion accelerators
                    </motion.p>
                </div>

                {/* Feature grid with animated cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                    {featuresData.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}

                    {/* Floating elements - decorative */}
                    <motion.div
                        className="absolute -top-10 -right-10 hidden lg:block"
                        variants={pulseAnimation}
                        initial="initial"
                        animate="animate"
                    >
                        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl">
                            <SparklesIcon className="h-6 w-6 text-blue-400" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute -bottom-10 -left-10 hidden lg:block"
                        variants={pulseAnimation}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 1 }}
                    >
                        <div className="bg-gradient-to-r from-rose-600/20 to-orange-600/20 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl">
                            <LockIcon className="h-6 w-6 text-rose-400" />
                        </div>
                    </motion.div>
                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex justify-center mt-12"
                >
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg px-8 py-6 text-lg">
                        Explore All Features
                    </Button>
                </motion.div>
            </div>
        </section>
    );
} 