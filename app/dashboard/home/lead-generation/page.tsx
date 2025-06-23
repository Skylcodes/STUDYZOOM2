import * as React from 'react';
import { FileText, BookOpen, CheckCircle, Clock, BarChart3 } from 'lucide-react';

import { GlassCard } from '@/components/ui/glass-card';

type DocumentStat = {
  id: string;
  title: string;
  icon: React.ReactNode;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
};

type DocumentType = {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
};

export default function DocumentStatisticsPage(): React.JSX.Element {
  const stats: DocumentStat[] = [
    {
      id: 'total-documents',
      title: 'Total Documents',
      icon: <FileText className="h-5 w-5" />,
      value: '124',
      description: 'Across all categories',
      trend: 'up',
      trendValue: '+12% from last month',
    },
    {
      id: 'studied',
      title: 'Studied',
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
      value: '87',
      description: 'Documents reviewed',
      trend: 'up',
      trendValue: '+8 this week',
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
      value: '42%',
      description: 'Of all documents',
      trend: 'up',
      trendValue: '+5% from last month',
    },
    {
      id: 'avg-time',
      title: 'Avg. Study Time',
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      value: '24 min',
      description: 'Per document',
      trend: 'down',
      trendValue: '-3 min from last week',
    },
  ];

  const documentTypes: DocumentType[] = [
    { id: 'pdf', name: 'PDFs', count: 64, percentage: 52, color: 'bg-blue-500' },
    { id: 'doc', name: 'Word', count: 32, percentage: 26, color: 'bg-indigo-500' },
    { id: 'ppt', name: 'Slides', count: 16, percentage: 13, color: 'bg-amber-500' },
    { id: 'other', name: 'Other', count: 12, percentage: 9, color: 'bg-gray-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Document Analytics</h2>
          <p className="text-muted-foreground">
            Insights and statistics about your study materials
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <GlassCard key={stat.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div
                className={`text-xs font-medium ${
                  stat.trend === 'up'
                    ? 'text-green-500'
                    : stat.trend === 'down'
                    ? 'text-red-500'
                    : 'text-amber-500'
                }`}
              >
                {stat.trendValue}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Document Types */}
      <GlassCard className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Document Types</h3>
          <p className="text-sm text-muted-foreground">
            Distribution of your study materials by file type
          </p>
        </div>
        <div className="space-y-4">
          {documentTypes.map((type) => (
            <div key={type.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{type.name}</span>
                <span className="text-sm text-muted-foreground">
                  {type.count} ({type.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${type.color} rounded-full`}
                  style={{ width: `${type.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Study Activity</h3>
          <p className="text-sm text-muted-foreground">
            Your recent study sessions and document interactions
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between border-b border-border/20 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {item === 1 && 'Completed Biology Chapter 5 Quiz'}
                    {item === 2 && 'Added new document: Math Final Notes'}
                    {item === 3 && 'Shared Chemistry Lab Report with group'}
                    {item === 4 && 'Created flashcards from History Notes'}
                    {item === 5 && 'Started new study session'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item === 1 && 'Scored 92% • 15 minutes ago'}
                    {item === 2 && 'PDF • 2 hours ago'}
                    {item === 3 && 'With Study Group • 5 hours ago'}
                    {item === 4 && '15 cards created • Yesterday'}
                    {item === 5 && 'Physics • 2 days ago'}
                  </p>
                </div>
              </div>
              <button className="rounded-md px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10">
                View
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
