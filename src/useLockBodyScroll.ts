import { useEffect } from "react";

export function useLockBodyScroll(isLocked: boolean) {
    useEffect(() => {
        if (isLocked) {
            const scrollBarWidth =
                window.innerWidth - document.documentElement.clientWidth;

            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [isLocked]);
}