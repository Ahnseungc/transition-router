"use client";

import React, { useEffect, useState } from "react";
import { useTransitionRouter } from "next-view-transitions";

declare global {
  interface Window {
    __isBackNavigation?: boolean;
  }
}

const PLACES: Record<
  number,
  {
    name: string;
    category: string;
    address: string;
    distance: string;
    rating: number;
    description: string;
    phone: string;
    hours: string;
  }
> = {
  1: {
    name: "강남역",
    category: "지하철역",
    address: "서울특별시 강남구 강남대로 396",
    distance: "0.3km",
    rating: 4.5,
    description:
      "강남역은 서울 지하철 2호선과 신분당선이 교차하는 주요 환승역입니다. 강남의 중심지로 각종 상업시설과 연결되어 있습니다.",
    phone: "02-1234-5678",
    hours: "05:30 - 00:30",
  },
  2: {
    name: "역삼역",
    category: "지하철역",
    address: "서울특별시 강남구 테헤란로 123",
    distance: "0.8km",
    rating: 4.3,
    description:
      "역삼역은 서울 지하철 2호선과 수인분당선이 교차하는 역입니다. 테헤란로와 인접하여 다양한 비즈니스 시설이 있습니다.",
    phone: "02-2345-6789",
    hours: "05:30 - 00:30",
  },
  3: {
    name: "선릉역",
    category: "지하철역",
    address: "서울특별시 강남구 테헤란로 234",
    distance: "1.2km",
    rating: 4.6,
    description:
      "선릉역은 서울 지하철 2호선과 분당선이 교차하는 주요 역입니다. 선릉과 정자동을 연결하는 교통 요충지입니다.",
    phone: "02-3456-7890",
    hours: "05:30 - 00:30",
  },
  4: {
    name: "삼성역",
    category: "지하철역",
    address: "서울특별시 강남구 테헤란로 345",
    distance: "1.5km",
    rating: 4.4,
    description:
      "삼성역은 서울 지하철 2호선이 지나가는 역입니다. 코엑스와 근접하여 국제 전시회와 각종 행사가 열리는 지역입니다.",
    phone: "02-4567-8901",
    hours: "05:30 - 00:30",
  },
  5: {
    name: "종합운동장역",
    category: "지하철역",
    address: "서울특별시 송파구 올림픽로 240",
    distance: "2.1km",
    rating: 4.2,
    description:
      "종합운동장역은 서울 지하철 2호선과 9호선이 교차하는 역입니다. 잠실올림픽주경기장과 인접해 있습니다.",
    phone: "02-5678-9012",
    hours: "05:30 - 00:30",
  },
};

export default function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useTransitionRouter();
  const [placeData, setPlaceData] = useState<typeof PLACES[number] | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      const place = PLACES[Number(id)];
      setPlaceData(place || null);
    });
  }, [params]);

  const handleBack = () => {
    // 인라인 스크립트가 popstate 이벤트를 감지하여 처리
    if (typeof window !== "undefined") {
      window.__isBackNavigation = true;
      document.documentElement.setAttribute("data-navigation", "back");
    }
    router.back();
  };

  if (!placeData || !id) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <button
            onClick={handleBack}
            className="mr-3 p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            aria-label="뒤로가기"
          >
            <svg
              className="w-6 h-6 text-black dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-black dark:text-white">
            상세정보
          </h1>
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              {placeData.name}
            </h2>
            <span className="text-sm text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">
              {placeData.category}
            </span>
          </div>
          <p className="text-base text-gray-600 dark:text-zinc-400">
            {placeData.address}
          </p>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-zinc-500">
            <span>{placeData.distance}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              ⭐ {placeData.rating}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
              설명
            </h3>
            <p className="text-base text-gray-700 dark:text-zinc-300 leading-relaxed">
              {placeData.description}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
              연락처
            </h3>
            <p className="text-base text-gray-700 dark:text-zinc-300">
              {placeData.phone}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
              운영시간
            </h3>
            <p className="text-base text-gray-700 dark:text-zinc-300">
              {placeData.hours}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

