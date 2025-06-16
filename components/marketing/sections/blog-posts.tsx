'use client';

import * as React from 'react';
import Link from 'next/link';
import { allPosts } from 'content-collections';
import { format, isBefore } from 'date-fns';
import { ArrowRightIcon, Calendar } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { getInitials } from '@/lib/utils';

export function BlogPosts(): React.JSX.Element {
  // Sort posts by date (newest first)
  const sortedPosts = React.useMemo(() => {
    return allPosts
      .slice()
      .sort((a, b) => (isBefore(a.published, b.published) ? 1 : -1));
  }, []);

  return (
    <section className="w-full py-24 bg-gradient-to-b from-black/5 to-black/20 dark:from-black/60 dark:to-black/90 backdrop-blur-sm">
      <div className="container px-4 mx-auto">
        {/* Header section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Blog </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Posts
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our latest ideas, insights, and updates from the HyperLaunch team.
          </p>
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, index) => {
            // Calculate a slight delay for staggered entrance
            const delay = index * 0.05;
            
            return (
              <div 
                key={index}
                className="relative h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ animationDelay: `${delay}s` }}
              >
                <Link
                  href={`${getBaseUrl()}${post.slug}`}
                  className="block h-full overflow-hidden"
                >
                  <div className="h-full rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 flex flex-col">
                    
                    {/* Date information */}
                    <div className="flex justify-end items-center mb-5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <time className="text-xs" dateTime={post.published}>
                          {format(post.published, 'dd MMM yyyy')}
                        </time>
                      </div>
                    </div>
                    
                    {/* Title with gradient highlight effect */}
                    <h2 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                      <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-blue-400 after:to-blue-600 after:transition-all after:duration-500">
                        {post.title}
                      </span>
                    </h2>
                    
                    {/* Description with truncation */}
                    <p className="line-clamp-3 text-muted-foreground text-sm mb-6">
                      {post.description}
                    </p>
                    
                    {/* Flexible spacer */}
                    <div className="flex-grow"></div>
                    
                    {/* Author and read more section with hover animations */}
                    <div className="flex items-center justify-between pt-5 mt-auto border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 ring-2 ring-blue-500/20 ring-offset-2 ring-offset-background/5">
                          <AvatarImage src={post.author?.avatar} alt={post.author?.name || 'Author'} />
                          <AvatarFallback className="bg-blue-500/10 text-blue-400 text-xs">
                            {getInitials(post.author?.name ?? '')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{post.author?.name ?? ''}</span>
                          <span className="text-xs text-muted-foreground">Author</span>
                        </div>
                      </div>
                      
                      <div className="group flex items-center gap-1.5">
                        <span className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 group-hover:after:w-full after:bg-blue-400 after:transition-all after:duration-300">
                          Read more
                        </span>
                        <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRightIcon className="h-4 w-4 text-blue-400" />
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-3 -right-3 h-24 w-24 bg-gradient-to-tr from-blue-500/0 to-blue-500/20 rounded-full blur-2xl -z-10" />
                  <div className="absolute -top-3 -left-3 h-16 w-16 bg-gradient-to-tr from-purple-500/0 to-purple-500/20 rounded-full blur-2xl -z-10" />
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-0 w-full h-1/2 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 -z-10 transform -rotate-6 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-purple-500/10 to-purple-900/0 -z-10 blur-3xl" />
      </div>
    </section>
  );
}
