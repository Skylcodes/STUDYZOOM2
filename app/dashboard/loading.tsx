import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            {/* Welcome Card Skeleton */}
            <div className="h-48 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6">
                <div className="h-8 w-64 bg-white/20 rounded-md"></div>
                <div className="h-4 w-80 mt-3 bg-white/20 rounded-md"></div>
                <div className="h-10 w-32 mt-4 bg-white/30 rounded-full"></div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        <div className="h-8 w-16 mt-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        <div className="mt-4 flex items-center">
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Documents Skeleton */}
                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="mt-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center p-3">
                                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                                <div className="ml-4 space-y-2">
                                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Study Progress Skeleton */}
                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="mt-6 h-64 bg-gray-100 dark:bg-gray-800/50 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
