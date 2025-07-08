import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
// @ts-expect-error - globals.css is a valid CSS file
// import globalsCss from "@/react/globals.css";
import globalsCss from "@/react/globals.css?inline";
import { Toaster } from "./ui/sonner";

interface ShadowWrapperProps {
  children: React.ReactNode;
  shadowRef: React.RefObject<HTMLDivElement | null>;
}

export const ShadowWrapper: React.FC<ShadowWrapperProps> = React.memo(
  ({ children, shadowRef }) => {
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

    useEffect(() => {
      if (shadowRef.current && !shadowRoot) {
        const shadow = shadowRef.current.attachShadow({ mode: "open" });
        setShadowRoot(shadow);
      }
    }, [shadowRef, shadowRoot]);

    return (
      <div ref={shadowRef}>
        {shadowRoot &&
          ReactDOM.createPortal(
            <>
              <style dangerouslySetInnerHTML={{ __html: globalsCss }} />
              {children}
              <Toaster />
            </>,
            shadowRoot
          )}
      </div>
    );
  }
);

ShadowWrapper.displayName = "ShadowWrapper";
