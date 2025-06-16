'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Lock, Server, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Technology {
    name: string;
    description: string;
    logo?: string;
    highlight?: boolean;
}

interface TechCategory {
    title: string;
    icon: React.ReactNode;
    description: string;
    technologies: Technology[];
}

interface TechCardProps {
    tech: Technology;
    index: number;
}

interface CategorySectionProps {
    category: TechCategory;
    index: number;
}

// Tech categories with descriptions
const techCategories: TechCategory[] = [
    {
        title: 'Frontend',
        icon: <Globe className="h-5 w-5 text-blue-400" />,
        description: 'Blazing fast UI with the latest React innovations',
        technologies: [
            {
                name: 'Next.js 14',
                description: 'The React framework for production with App Router',
                logo: '/logos/nextjs.svg',
                highlight: true
            },
            {
                name: 'React 18',
                description: 'Component-based UI with concurrent features',
                logo: '/logos/react.svg'
            },
            {
                name: 'TypeScript',
                description: 'Type-safe code for scalable applications',
                logo: '/logos/typescript.svg'
            },
            {
                name: 'Tailwind CSS',
                description: 'Utility-first CSS for rapid UI development',
                logo: '/logos/tailwind.svg'
            }
        ]
    },
    {
        title: 'Backend',
        icon: <Server className="h-5 w-5 text-purple-400" />,
        description: 'Scalable server-side solutions for enterprise needs',
        technologies: [
            {
                name: 'Node.js',
                description: 'JavaScript runtime for scalable backend operations',
                logo: '/logos/nodejs.svg'
            },
            {
                name: 'Prisma',
                description: 'Next-gen ORM for intuitive database access',
                logo: '/logos/prisma.svg',
                highlight: true
            },
            {
                name: 'tRPC',
                description: 'End-to-end typesafe APIs with TypeScript',
                logo: '/logos/trpc.svg'
            },
            {
                name: 'Auth.js',
                description: 'Authentication for modern applications',
                logo: '/logos/authjs.svg'
            }
        ]
    },
    {
        title: 'Database',
        icon: <Database className="h-5 w-5 text-green-400" />,
        description: 'Reliable data storage and management solutions',
        technologies: [
            {
                name: 'PostgreSQL',
                description: 'Advanced open-source relational database',
                logo: '/logos/postgres.svg',
                highlight: true
            },
            {
                name: 'Redis',
                description: 'In-memory data structure store for caching',
                logo: '/logos/redis.svg'
            },
            {
                name: 'Vercel Storage',
                description: 'Edge-optimized database and storage solutions',
                logo: '/logos/vercel.svg'
            }
        ]
    },
    {
        title: 'DevOps',
        icon: <Zap className="h-5 w-5 text-amber-400" />,
        description: 'Seamless deployment and infrastructure management',
        technologies: [
            {
                name: 'Docker',
                description: 'Containerization for consistent environments',
                logo: '/logos/docker.svg'
            },
            {
                name: 'GitHub Actions',
                description: 'CI/CD automation for seamless deployment',
                logo: '/logos/github.svg'
            },
            {
                name: 'Vercel',
                description: 'Global deployment platform for frontend and backend',
                logo: '/logos/vercel.svg',
                highlight: true
            }
        ]
    },
    {
        title: 'Security',
        icon: <Lock className="h-5 w-5 text-red-400" />,
        description: 'Enterprise-grade security for peace of mind',
        technologies: [
            {
                name: 'Auth.js',
                description: 'Authentication with OAuth providers and magic links',
                logo: '/logos/authjs.svg',
                highlight: true
            },
            {
                name: 'JWT',
                description: 'Secure token-based user sessions',
                logo: '/logos/jwt.svg'
            },
            {
                name: 'HTTPS/TLS',
                description: 'Encrypted data transmission',
                logo: '/logos/tls.svg'
            }
        ]
    },
    {
        title: 'APIs & Integration',
        icon: <Code className="h-5 w-5 text-cyan-400" />,
        description: 'Connect with external services and platforms',
        technologies: [
            {
                name: 'RESTful APIs',
                description: 'Standards-based API architecture',
                logo: '/logos/rest.svg'
            },
            {
                name: 'GraphQL',
                description: 'Flexible, efficient data fetching',
                logo: '/logos/graphql.svg'
            },
            {
                name: 'Stripe',
                description: 'Payment processing and subscription management',
                logo: '/logos/stripe.svg',
                highlight: true
            },
            {
                name: 'SendGrid',
                description: 'Email delivery and management',
                logo: '/logos/sendgrid.svg'
            }
        ]
    }
];

// Placeholder logo component
const LogoPlaceholder = ({ name, size }: { name: string; size: number }) => {
    // Extract first letter of each word
    const initials = name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();

    return (
        <div
            className={cn(
                "bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-white/10 flex items-center justify-center",
                size === 24 ? "w-6 h-6" : "w-10 h-10"
            )}
        >
            <span className={cn(
                "text-white font-bold",
                size === 24 ? "text-xs" : "text-sm"
            )}>
                {initials}
            </span>
        </div>
    );
};

// TechCard component
const TechCard: React.FC<TechCardProps> = ({ tech, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className={cn(
                "flex items-center gap-4 rounded-xl p-4 bg-black/30 backdrop-blur-sm border transition-all duration-300",
                tech.highlight
                    ? "border-blue-500/30 shadow-glow"
                    : "border-white/5 hover:border-white/20"
            )}
        >
            <div className="relative h-10 w-10 flex-shrink-0">
                {tech.logo ? (
                    <Image
                        src={tech.logo}
                        alt={tech.name}
                        fill
                        className="object-contain"
                    />
                ) : (
                    <LogoPlaceholder name={tech.name} size={40} />
                )}
            </div>
            <div>
                <h4 className={cn(
                    "font-medium",
                    tech.highlight ? "text-blue-400" : "text-white"
                )}>
                    {tech.name}
                </h4>
                <p className="text-gray-400 text-sm line-clamp-2">{tech.description}</p>
            </div>
        </motion.div>
    );
};

// Category section component
const CategorySection: React.FC<CategorySectionProps> = ({ category, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
            className="mb-16"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10">
                    {category.icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    <p className="text-gray-400 text-sm">{category.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.technologies.map((tech: Technology, techIndex: number) => (
                    <TechCard key={techIndex} tech={tech} index={techIndex} />
                ))}
            </div>
        </motion.div>
    );
};

export function TechStack(): React.JSX.Element {
    return (
        <section className="w-full py-20 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute left-1/4 -top-48 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute right-1/3 -bottom-32 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>

            <div className="container px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="mb-4 bg-black/30 text-cyan-400 hover:bg-black/50 border-cyan-600/30 backdrop-blur-md px-4 py-1 rounded-full">
                            Modern Stack
                        </Badge>

                        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                            Built with Cutting-Edge Tech
                        </h2>

                        <p className="text-gray-400 md:text-lg max-w-2xl mx-auto">
                            Our boilerplate leverages the most advanced technologies to ensure your project is future-proof, scalable, and maintainable.
                        </p>
                    </motion.div>
                </div>

                {/* Tech Categories */}
                <div>
                    {techCategories.map((category, index) => (
                        <CategorySection key={index} category={category} index={index} />
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg rounded-full px-8">
                        View Complete Documentation
                    </Button>
                    <p className="mt-4 text-gray-400 text-sm">
                        Extensive technical docs with examples and best practices
                    </p>
                </motion.div>
            </div>
        </section>
    );
} 