'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, HelpCircle, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PricingFeature {
    text: string;
    footnote?: string;
    negative?: boolean;
}

interface PricingTier {
    name: string;
    description: string;
    price: {
        monthly: number;
        annually: number;
    };
    features: PricingFeature[];
    cta: string;
    highlighted?: boolean;
    badge?: string;
}

const tiers: PricingTier[] = [
    {
        name: 'Basic',
        description: 'Everything you need to get started with a small project.',
        price: {
            monthly: 49,
            annually: 39
        },
        features: [
            { text: 'Up to 3 team members' },
            { text: '5GB storage' },
            { text: 'Basic analytics dashboard' },
            { text: 'Standard support (24h response)' },
            { text: 'Custom domain', footnote: 'One domain only' },
            { text: 'White-label option', negative: true }
        ],
        cta: 'Get Started'
    },
    {
        name: 'Pro',
        description: 'Perfect for growing teams and serious businesses.',
        price: {
            monthly: 99,
            annually: 79
        },
        highlighted: true,
        badge: 'Most Popular',
        features: [
            { text: 'Up to 10 team members' },
            { text: '25GB storage' },
            { text: 'Advanced analytics dashboard' },
            { text: 'Priority support (6h response)' },
            { text: 'Multiple custom domains' },
            { text: 'White-label option' },
            { text: 'API access' },
            { text: 'Automated backups' }
        ],
        cta: 'Upgrade to Pro'
    },
    {
        name: 'Enterprise',
        description: 'For organizations with advanced scalability needs.',
        price: {
            monthly: 299,
            annually: 249
        },
        features: [
            { text: 'Unlimited team members' },
            { text: '100GB storage' },
            { text: 'Custom analytics dashboard' },
            { text: 'Dedicated support (1h response)' },
            { text: 'Unlimited custom domains' },
            { text: 'White-label option' },
            { text: 'Advanced API access' },
            { text: 'Automated backups' },
            { text: 'SSO and advanced security' },
            { text: 'Custom integrations' },
            { text: 'Dedicated account manager' }
        ],
        cta: 'Contact Sales'
    }
];

export function Pricing(): React.JSX.Element {
    const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annually'>('monthly');

    // Calculate discounting percentage between monthly and annual
    const discountPercentage = Math.round(((tiers[1].price.monthly * 12) - (tiers[1].price.annually * 12)) / (tiers[1].price.monthly * 12) * 100);

    return (
        <section className="w-full py-20 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute right-1/4 -top-32 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute left-1/3 -bottom-32 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="container px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="mb-4 bg-black/30 text-purple-400 hover:bg-black/50 border-purple-600/30 backdrop-blur-md px-4 py-1 rounded-full">
                            Simple Pricing
                        </Badge>

                        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                            Choose Your Growth Plan
                        </h2>

                        <p className="text-gray-400 md:text-lg max-w-2xl mx-auto mb-8">
                            Transparent pricing designed to scale with your business. No hidden fees, cancel anytime.
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none",
                                    billingCycle === 'monthly'
                                        ? "text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('annually')}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none",
                                    billingCycle === 'annually'
                                        ? "text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                Annually
                                <span className="absolute -top-1 -right-1 px-2 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full">
                                    -{discountPercentage}%
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "relative",
                                tier.highlighted ? "md:-mt-8 md:mb-8" : ""
                            )}
                        >
                            {/* Premium Tier with special border */}
                            <div className={cn(
                                "rounded-3xl overflow-hidden",
                                tier.highlighted ? "p-[2px] bg-gradient-to-b from-purple-500 via-blue-500 to-indigo-500" : ""
                            )}>
                                <div className={cn(
                                    "h-full bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6 md:p-8 relative overflow-hidden",
                                    tier.highlighted ? "shadow-glow" : ""
                                )}>
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 bg-space-pattern opacity-30"></div>

                                    {/* Badge */}
                                    {tier.badge && (
                                        <div className="absolute right-8 top-0">
                                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-b-lg shadow-lg">
                                                {tier.badge}
                                            </div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                                        <p className="text-gray-400 mt-2 min-h-[40px]">{tier.description}</p>

                                        {/* Price */}
                                        <div className="mt-6 mb-8">
                                            <div className="flex items-baseline">
                                                <span className="text-5xl font-bold text-white">
                                                    ${billingCycle === 'monthly' ? tier.price.monthly : tier.price.annually}
                                                </span>
                                                <span className="text-gray-400 ml-2">/ month</span>
                                            </div>

                                            {billingCycle === 'annually' && (
                                                <div className="text-sm text-green-400 mt-1">
                                                    Billed annually (${tier.price.annually * 12}/year)
                                                </div>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-3 mb-8">
                                            {tier.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start">
                                                    {feature.negative ? (
                                                        <X className="h-5 w-5 text-gray-500 mr-2 shrink-0 mt-0.5" />
                                                    ) : (
                                                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                                    )}
                                                    <span className={cn(
                                                        "text-sm",
                                                        feature.negative ? "text-gray-500" : "text-gray-300"
                                                    )}>
                                                        {feature.text}
                                                        {feature.footnote && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <HelpCircle className="inline h-3.5 w-3.5 text-gray-500 ml-1 cursor-help" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="max-w-xs">
                                                                        <p>{feature.footnote}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button */}
                                        <Button
                                            className={cn(
                                                "w-full rounded-xl",
                                                tier.highlighted
                                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                                                    : "border border-white/20 bg-white/5 hover:bg-white/10 text-white"
                                            )}
                                        >
                                            {tier.cta}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Enterprise Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 rounded-3xl overflow-hidden"
                >
                    <div className="p-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-3xl">
                        <div className="bg-black/60 backdrop-blur-md p-8 md:p-12 rounded-3xl relative overflow-hidden">
                            {/* Background pattern */}
                            <div className="absolute inset-0 bg-space-pattern opacity-20"></div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Need a custom solution?</h3>
                                    <p className="text-gray-400 md:text-lg max-w-2xl">
                                        Contact our sales team for custom pricing and enterprise-level support.
                                    </p>
                                </div>
                                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg rounded-xl px-8 py-6 h-auto whitespace-nowrap">
                                    Contact Sales
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
} 