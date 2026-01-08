"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __isBackNavigation?: boolean;
  }
}

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const originalStartViewTransitionRef = useRef<
    typeof document.startViewTransition | null
  >(null);

  useEffect(() => {
    // 뒤로가기 감지 - 최소한의 클라이언트 사이드 로직
    if (typeof window === "undefined") return;

    // 전역 플래그 초기화
    if (!window.__isBackNavigation) {
      window.__isBackNavigation = false;
    }

    // View Transition API intercept
    if (document.startViewTransition) {
      originalStartViewTransitionRef.current = document.startViewTransition;

      document.startViewTransition = function (callback) {
        const isBack = window.__isBackNavigation;
        const root = document.documentElement;

        console.log("[ViewTransition] 시작, isBack:", isBack);

        if (isBack) {
          // 뒤로가기: 속성 강제 설정
          root.setAttribute("data-navigation", "back");
          console.log("[ViewTransition] ✅ 뒤로가기 속성 설정");

          // 여러 프레임에 걸쳐 확인하여 유지 (View Transition 시작 전까지)
          let frameCount = 0;
          const maxFrames = 20;

          const ensureAttribute = () => {
            if (frameCount < maxFrames && window.__isBackNavigation) {
              if (!root.hasAttribute("data-navigation")) {
                root.setAttribute("data-navigation", "back");
                console.log(
                  `[ViewTransition] 속성 재설정 (프레임 ${frameCount})`
                );
              }
              frameCount++;
              requestAnimationFrame(ensureAttribute);
            }
          };
          requestAnimationFrame(ensureAttribute);
        } else {
          // 전진: 속성 제거
          root.removeAttribute("data-navigation");
          console.log("[ViewTransition] ✅ 전진 네비게이션");
        }

        const transition = originalStartViewTransitionRef.current
          ? originalStartViewTransitionRef.current.call(document, callback)
          : (callback as ViewTransitionUpdateCallback)();

        // 애니메이션 완료 후 정리
        if (
          transition &&
          typeof transition === "object" &&
          "finished" in transition
        ) {
          transition.finished.finally(() => {
            setTimeout(() => {
              root.removeAttribute("data-navigation");
              window.__isBackNavigation = false;
            }, 50);
          });
        }

        return transition as ViewTransition;
      };
    }

    // PopState 이벤트 - 뒤로가기 감지
    const handlePopState = () => {
      window.__isBackNavigation = true;
      const root = document.documentElement;
      root.setAttribute("data-navigation", "back");

      // 여러 프레임에 걸쳐 확인 (View Transition 시작 전까지)
      let frameCount = 0;
      const maxFrames = 20;

      const ensureAttribute = () => {
        if (frameCount < maxFrames && window.__isBackNavigation) {
          if (!root.hasAttribute("data-navigation")) {
            root.setAttribute("data-navigation", "back");
          }
          frameCount++;
          requestAnimationFrame(ensureAttribute);
        }
      };
      requestAnimationFrame(ensureAttribute);

      // 애니메이션 후 정리
      setTimeout(() => {
        root.removeAttribute("data-navigation");
        window.__isBackNavigation = false;
      }, 350);
    };

    // Link 클릭 - 전진 네비게이션
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href]");
      const button = target.closest("button");
      const isBackButton = button?.getAttribute("aria-label")?.includes("뒤로");

      if (link && !isBackButton) {
        window.__isBackNavigation = false;
        document.documentElement.removeAttribute("data-navigation");
      }
    };

    window.addEventListener("popstate", handlePopState, { capture: true });
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("popstate", handlePopState, { capture: true });
      document.removeEventListener("click", handleClick, true);

      // 원본 함수 복원
      if (
        originalStartViewTransitionRef.current &&
        document.startViewTransition
      ) {
        document.startViewTransition = originalStartViewTransitionRef.current;
      }
    };
  }, []);

  return <>{children}</>;
}
