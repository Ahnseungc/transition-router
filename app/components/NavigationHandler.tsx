"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __isBackNavigation?: boolean;
  }
}

export function NavigationHandler() {
  useEffect(() => {
    console.log("[NavigationHandler] 초기화 시작");

    // View Transition API를 intercept하여 뒤로가기 감지
    const originalStartViewTransition = document.startViewTransition;

    if (!originalStartViewTransition) {
      console.warn(
        "[NavigationHandler] ⚠️ View Transition API를 사용할 수 없습니다"
      );
    } else {
      console.log("[NavigationHandler] ✅ View Transition API intercept 설정");
    }

    if (typeof originalStartViewTransition === "function") {
      document.startViewTransition = function (callback) {
        console.log("[ViewTransition] 시작");
        console.log(
          "[ViewTransition] __isBackNavigation:",
          window.__isBackNavigation
        );
        console.log(
          "[ViewTransition] 현재 data-navigation:",
          document.documentElement.getAttribute("data-navigation")
        );

        // 뒤로가기 플래그 확인
        if (window.__isBackNavigation) {
          document.documentElement.setAttribute("data-navigation", "back");
          console.log("[ViewTransition] ✅ 뒤로가기 애니메이션 설정");
        } else {
          document.documentElement.removeAttribute("data-navigation");
          console.log("[ViewTransition] ✅ 전진 애니메이션 설정");
        }

        const transition = originalStartViewTransition.call(document, callback);

        // 애니메이션 완료 후 속성 제거
        transition.finished.finally(() => {
          setTimeout(() => {
            document.documentElement.removeAttribute("data-navigation");
            window.__isBackNavigation = false;
            console.log("[ViewTransition] 애니메이션 완료, 속성 제거");
          }, 50);
        });

        return transition;
      };
    }

    // 브라우저 뒤로가기/앞으로가기 버튼 감지
    const handlePopState = () => {
      console.log("[PopState] 이벤트 발생");
      // 플래그 설정 (View Transition 시작 전에)
      window.__isBackNavigation = true;

      const root = document.documentElement;
      // 즉시 속성 설정
      root.setAttribute("data-navigation", "back");
      console.log("[PopState] ✅ 뒤로가기 플래그 및 속성 설정");
      console.log(
        "[PopState] data-navigation:",
        root.getAttribute("data-navigation")
      );

      // 여러 프레임에 걸쳐 속성 유지
      ensureBackNavigation();
    };

    // 전진 네비게이션 감지 (Link 클릭 등)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href]");
      const button = target.closest("button");

      // Link 클릭이고 뒤로가기 버튼이 아닌 경우 전진 네비게이션
      const isBackButton = button?.getAttribute("aria-label")?.includes("뒤로");
      if (link && !isBackButton) {
        console.log("[LinkClick] 전진 네비게이션 감지");
        window.__isBackNavigation = false;
        document.documentElement.removeAttribute("data-navigation");
        console.log(
          "[LinkClick] ✅ 전진 네비게이션 설정 (뒤로가기 플래그 해제)"
        );
      }
    };

    // View Transition 시작 전에 속성을 확실히 설정하기 위한 타이머
    // router.back() 호출 후 즉시 여러 프레임에 걸쳐 확인
    let backNavigationInterval: ReturnType<typeof setInterval> | null = null;

    const ensureBackNavigation = () => {
      if (window.__isBackNavigation) {
        const root = document.documentElement;
        root.setAttribute("data-navigation", "back");
        console.log(
          "[EnsureBack] ✅ 뒤로가기 속성 확인:",
          root.getAttribute("data-navigation")
        );

        // 최대 300ms 동안 확인 (애니메이션 시간)
        let attempts = 0;
        const maxAttempts = 20; // 300ms / 15ms = 20

        if (backNavigationInterval) {
          clearInterval(backNavigationInterval);
        }

        backNavigationInterval = setInterval(() => {
          attempts++;
          if (
            window.__isBackNavigation &&
            !root.hasAttribute("data-navigation")
          ) {
            root.setAttribute("data-navigation", "back");
            console.log(`[EnsureBack] ✅ 속성 재설정 (시도 ${attempts})`);
          }

          if (attempts >= maxAttempts) {
            if (backNavigationInterval) {
              clearInterval(backNavigationInterval);
              backNavigationInterval = null;
            }
          }
        }, 15); // 60fps
      }
    };

    window.addEventListener("popstate", handlePopState, { capture: true });
    document.addEventListener("click", handleClick, true);

    console.log("[NavigationHandler] ✅ 이벤트 리스너 등록 완료");

    return () => {
      window.removeEventListener("popstate", handlePopState, { capture: true });
      document.removeEventListener("click", handleClick, true);

      if (backNavigationInterval) {
        clearInterval(backNavigationInterval);
      }

      // 원본 함수 복원
      if (typeof originalStartViewTransition === "function") {
        document.startViewTransition = originalStartViewTransition;
      }
    };
  }, []);

  return null;
}
