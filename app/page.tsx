import { PlaceListClient } from "./components/PlaceListClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-semibold text-black dark:text-white">
            주변 검색
          </h1>
        </div>
      </header>

      {/* 리스트 - React Query 사용 */}
      <main className="max-w-md mx-auto bg-white dark:bg-black">
        <PlaceListClient />
      </main>
    </div>
  );
}
