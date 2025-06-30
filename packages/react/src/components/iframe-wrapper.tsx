import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
// @ts-expect-error - globals.css is a valid CSS file
import globalsCss from "../globals.css";

interface IframeWrapperProps {
  children: React.ReactNode;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export const IframeWrapper: React.FC<IframeWrapperProps> = React.memo(
  ({ children, iframeRef }) => {
    const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);
    const styleRef = useRef<HTMLStyleElement | null>(null);
    const resizeObserver = useRef<ResizeObserver | null>(null);

    const injectStyles = useCallback((doc: Document) => {
      // Clean up previous style
      if (styleRef.current?.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }
      const styleEl = doc.createElement("style");
      styleEl.textContent = globalsCss;
      doc.head.appendChild(styleEl);
      styleRef.current = styleEl;
    }, []);

    const updateHeight = useCallback(() => {
      const iframe = iframeRef.current;
      const doc = iframe?.contentDocument;
      if (iframe && doc) {
        const height = doc.body.scrollHeight;
        iframe.style.height = `${height}px`;
      }
    }, [iframeRef]);

    const handleLoad = useCallback(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument!;

      injectStyles(doc);
      setIframeBody(doc.body);
      updateHeight();

      // Observe body mutations & size
      if ("ResizeObserver" in window) {
        resizeObserver.current = new ResizeObserver(updateHeight);
        resizeObserver.current.observe(doc.body);
      }
    }, [iframeRef, injectStyles, updateHeight]);

    useLayoutEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // Attach onLoad
      iframe.addEventListener("load", handleLoad);
      // If already loaded
      if (iframe.contentDocument?.readyState === "complete") {
        handleLoad();
      }

      return () => {
        iframe.removeEventListener("load", handleLoad);
        resizeObserver.current?.disconnect();
        if (styleRef.current?.parentNode) {
          styleRef.current.parentNode.removeChild(styleRef.current);
        }
      };
    }, [iframeRef, handleLoad]);

    // Update on window resize
    useEffect(() => {
      window.addEventListener("resize", updateHeight);
      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }, [updateHeight]);

    return (
      <div
        id="bs-wrapper"
        className="relative mx-auto min-h-screen w-full max-w-[1200px] overflow-y-auto overflow-x-hidden"
      >
        <iframe
          ref={iframeRef}
          className="min-h-screen w-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
        />
        {iframeBody && ReactDOM.createPortal(children, iframeBody)}
      </div>
    );
  }
);

IframeWrapper.displayName = "IframeWrapper";
