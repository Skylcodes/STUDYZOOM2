import * as React from 'react';

import { GridSection } from '@/components/marketing/fragments/grid-section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TEAM = [
  {
    name: 'Alex Johnson',
    role: 'Founder & Lead Developer',
    image: '/marketing/team/alex-johnson.webp',
    bio: '10+ years of experience in full-stack development. Created and launched over 50+ boilerplates used by thousands of developers worldwide.'
  },
  {
    name: 'Sarah Williams',
    role: 'UI/UX Specialist',
    image: '/marketing/team/sarah-williams.webp',
    bio: 'Expert in creating beautiful, intuitive interfaces. Ensures all our boilerplates follow the latest design trends and best practices.'
  },
  {
    name: 'Michael Chen',
    role: 'DevOps Engineer',
    image: '/marketing/team/michael-chen.webp',
    bio: 'Specializes in deployment and infrastructure. Makes sure our boilerplates are optimized for performance and security.'
  }
];

export function StoryTeam(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container max-w-6xl py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-border/40 bg-background/50 px-4 py-1.5 text-sm font-medium text-primary">
            The Team
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Who builds these boilerplates?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A small but mighty team of experienced developers and designers
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((person, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/50 p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="size-24 border-4 border-primary/10">
                    <AvatarImage
                      src={person.image}
                      alt={person.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl bg-primary/5">
                      {person.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 flex items-center justify-center rounded-full bg-background p-1.5 shadow-md">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold">{person.name}</h3>
                  <p className="mt-1 text-primary">{person.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {person.bio}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>


      </div>
    </GridSection>
  );
}
