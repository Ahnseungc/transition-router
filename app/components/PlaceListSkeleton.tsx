export function PlaceListSkeleton() {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
      {Array.from({ length: 5 }).map((_, index) => (
        <li key={index} className="px-4 py-4 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-800 rounded mb-1" />
              <div className="flex items-center gap-3 mt-2">
                <div className="h-3 w-12 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-1 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
            <div className="h-5 w-5 bg-gray-200 dark:bg-zinc-800 rounded ml-2" />
          </div>
        </li>
      ))}
    </ul>
  );
}
