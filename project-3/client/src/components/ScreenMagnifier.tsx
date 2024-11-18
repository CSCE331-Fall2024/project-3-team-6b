import React, { useState, useEffect, useRef } from 'react';

const ScreenMagnifier = ({ enabled = false, magnification = 2 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const magnifierRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;
    
    const updateMagnifierContent = (iframe: HTMLIFrameElement, x: number, y: number) => {
      if (iframe.contentDocument) {
        const content = iframe.contentDocument.documentElement.cloneNode(true) as HTMLElement;
    
        // Remove scripts for safety
        content.querySelectorAll('script').forEach(script => script.remove());
    
        // Pull styles from the current document
        const styles = Array.from(document.styleSheets).map(sheet => {
          try {
            if (sheet.href) {
              return `<link rel="stylesheet" href="${sheet.href}" />`; // External stylesheets
            }
            return `<style>${Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n')}</style>`; // Internal styles
          } catch {
            if (sheet.href) {
              return `<link rel="stylesheet" href="${sheet.href}" />`; // External stylesheets
            }
            return ''; // Return empty if styles can't be fetched
          }
        }).join('');
    
        // Write the content to the iframe
        iframe.contentDocument.open();
        iframe.contentDocument.write(`
          <!DOCTYPE html>
          <html>
            <head>
              ${styles} <!-- Inject styles here -->
            </head>
            <body>
              ${content.innerHTML}
            </body>
          </html>
        `);
        iframe.contentDocument.close();
    
        // Now, adjust the content inside the iframe to zoom in
        const imageArea = iframe.contentDocument.querySelector('body');
        if (imageArea) {
          // Zoom in around the mouse position
          const scaleX = x / window.innerWidth;
          const scaleY = y / window.innerHeight;
          iframe.contentDocument.body.style.transform = `scale(${magnification})`;
          iframe.contentDocument.body.style.transformOrigin = `${scaleX * 100}% ${scaleY * 100}%`;
        }
      }
    };
    

    
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX; // Use clientX to exclude scroll offset
      const y = e.clientY; // Use clientY to exclude scroll offset
    

      const xNum = e.pageX; // Use pageX to include scroll offset
      const yNum = e.pageY;
      // Update magnifier position
      setPosition({ x, y });
      setIsVisible(true);
    
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        const iframe = magnifierRef.current?.querySelector<HTMLIFrameElement>('iframe');
        if (iframe) {
          updateMagnifierContent(iframe, x, y);
        }
      }, 25); // Update every 50ms, can adjust based on performance needs

      // Adjust the content translation
      if (contentRef.current) {
        const lensWidth = 1000; // Width of your magnifier lens
        const lensHeight = 500; // Height of your magnifier lens
    
        // Calculate the offset for the content translation
        const offsetX = xNum - lensWidth / 2;
        const offsetY = yNum - lensHeight / 2;
    
        contentRef.current.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;
      }
    };
    
   

    const handleMouseLeave = () => {
      setIsVisible(false);
      
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <>
      {/* Semi-transparent overlay to capture the current view */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        {/* Magnifier lens */}
        <div
          className="fixed rounded-full overflow-hidden border-2 border-gray-200 shadow-lg bg-white"
          style={{
            width: '1000px',
            height: '500px',
            left: position.x - 1000, // Center the lens horizontally
            top: position.y - 500,  // Center the lens vertically
            zIndex: 10000,
         }}
         
        >
          {/* Content container */}
          <div
            ref={contentRef}
            className="absolute origin-center"
            style={{
              width: '100vw',
              height: '100vh',
              transform: `translate(${-position.x + 100}px, ${-position.y + 100}px)`,
            }}
          >
            {/* Scaled content */}
            <div
                style={{
                    transform: `scale(${magnification})`,
                    transformOrigin: `${position.x}px ${position.y}px`,
                }}
              >

              <div id="magnifier-content" className="w-screen h-screen" ref={magnifierRef}>
                <iframe
                
                  src="about:blank"
                  className="w-full h-full border-0"
                  style={{
                    pointerEvents: 'none',
                    transform: 'translateZ(0)',
                  }}
                  onLoad={(e) => {
                    const iframe = e.target as HTMLIFrameElement;
            
                    if (iframe.contentDocument) {
                      // Copy the current page's styles
                      const styles = Array.from(document.styleSheets).map(sheet => {
                        try {
                          if (sheet.href) {
                            return `<link rel="stylesheet" href="${sheet.href}" />`;
                          }
                          return `<style>${Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n')}</style>`;
                        } catch {
                          if (sheet.href) {
                            return `<link rel="stylesheet" href="${sheet.href}" />`;
                          }
                          return '';
                        }
                      }).join('');

                      // Copy the current page's content
                      const content = document.documentElement.cloneNode(true) as HTMLElement;
                      
                      // Remove any scripts for safety
                      content.querySelectorAll('script').forEach(script => script.remove());
                      
                      // Write the content to the iframe
                      iframe.contentDocument.open();
                      iframe.contentDocument.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>${styles}</head>
                          <body>${content.querySelector('body')?.innerHTML || ''}</body>
                        </html>
                      `);
                      iframe.contentDocument.close();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenMagnifier;