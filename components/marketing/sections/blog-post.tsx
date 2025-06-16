'use client';

import * as React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Calendar } from 'lucide-react';

import { Mdx } from '@/components/marketing/blog/mdx-component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';

type BlogPostProps = {
  post: {
    title: string;
    description: string;
    published: string;
    category: string;
    author:
      | {
          name?: string;
          avatar?: string;
        }
      | undefined;
    body: {
      raw: string;
      code: string;
    };
  };
};

export function BlogPost({ post }: BlogPostProps): React.JSX.Element {
  // State for tracking scroll position for the progress bar
  const [scrollProgress, setScrollProgress] = React.useState(0);

  // Handle scroll events for progress bar
  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-black/5 dark:from-background dark:to-black/40">
      {/* Fixed header with progress bar */}
      <div className="sticky top-16 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="container flex justify-between items-center py-3 max-w-7xl mx-auto">
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to all articles</span>
          </Link>
        </div>
        {/* Reading progress bar */}
        <div 
          className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero section with title and metadata */}
      <div className="relative overflow-hidden py-20 md:py-32 border-b border-border/20">
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10 items-start">
            <div className="space-y-6">

              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                {post.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                {post.description}
              </p>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 flex flex-col gap-6 sticky top-28 shadow-lg">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 rounded-xl border-2 border-primary/20">
                  <AvatarImage src={post.author?.avatar} alt={post.author?.name || 'Author'} />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {getInitials(post.author?.name ?? '')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-medium text-lg">{post.author?.name ?? 'Anonymous'}</div>
                  <div className="text-sm text-muted-foreground">Author</div>
                </div>
              </div>
              
              <Separator className="bg-border/40" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Published</div>
                  <div className="font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <time dateTime={post.published}>
                      {format(post.published, 'dd MMM yyyy')}
                    </time>
                  </div>
                </div>
                

              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-50 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
      </div>

      {/* Article content with enhanced styling */}
      <div className="container max-w-3xl mx-auto py-16 px-4">
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-xl prose-img:shadow-lg max-w-none">
          <Mdx code={post.body.code} />
        </div>
      </div>
      
      {/* Footer with next/prev articles would go here */}
      <div className="container max-w-5xl mx-auto px-4 py-16 border-t border-border/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 text-sm px-5 py-2.5 bg-card hover:bg-card/80 rounded-full transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>View all articles</span>
          </Link>

        </div>
      </div>
    </div>
  );
}


