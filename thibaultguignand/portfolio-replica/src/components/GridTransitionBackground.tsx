import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './GridTransitionBackground.css';

gsap.registerPlugin(useGSAP);

interface GridTransitionBackgroundProps {
  currentImage: string;
}

const GridTransitionBackground = ({ currentImage }: GridTransitionBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([currentImage]);

  // Keep track of the active animation timeline to prevent overlaps
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Synchronize state with prop changes
  if (currentImage !== images[images.length - 1]) {
    setImages(prev => [...prev, currentImage]);
  }

  useGSAP(() => {
    if (images.length <= 1) return;

    const container = containerRef.current;
    if (!container) return;

    const newImageIndex = images.length - 1;
    const newGrid = container.children[newImageIndex] as HTMLElement;
    if (!newGrid) return;

    const cells = newGrid.querySelectorAll('.grid-cell');

    if (tl.current) tl.current.kill();

    tl.current = gsap.timeline({
      onComplete: () => {
        // Cleanup old images
        if (images.length > 5) {
            setImages([images[images.length - 1]]);
        }
      }
    });

    // Intense glitch filter flash on the container
    tl.current.to(container, {
      filter: 'hue-rotate(180deg) contrast(200%) saturate(300%) invert(10%)',
      duration: 0.05,
      yoyo: true,
      repeat: 3,
      ease: 'steps(1)'
    }, 0);

    // Stagger cells with aggressive clip-path reveal and transforms
    tl.current.fromTo(cells, 
      { 
        clipPath: 'inset(50% 50% 50% 50%)',
        opacity: 0,
        scale: () => gsap.utils.random(1.2, 2),
        x: () => gsap.utils.random(-100, 100),
        y: () => gsap.utils.random(-100, 100)
      },
      { 
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1, 
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.6,
        stagger: {
          amount: 0.4,
          grid: [8, 8],
          from: 'random'
        },
        ease: 'expo.out'
      }, 
      0
    );

    // Clean up filter
    tl.current.to(container, { filter: 'none', duration: 0.1 }, '>');

  }, { dependencies: [images.length], scope: containerRef });

  const rows = 8;
  const cols = 8;
  const totalCells = rows * cols;

  return (
    <div className="grid-bg-container" ref={containerRef}>
      {images.map((imgSrc, index) => {
        const isInitial = index === 0 && images.length === 1;

        return (
          <div 
            key={`${imgSrc}-${index}`} 
            className="grid-layer"
            style={{ zIndex: index }}
          >
            {Array.from({ length: totalCells }).map((_, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              
              const bgPosX = (col / (cols - 1)) * 100;
              const bgPosY = (row / (rows - 1)) * 100;

              return (
                <div 
                  key={i} 
                  className="grid-cell"
                  style={{
                    backgroundImage: `url(${imgSrc})`,
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    backgroundSize: `${cols * 100}% ${rows * 100}%`,
                    opacity: isInitial ? 1 : 0
                  }}
                />
              );
            })}
          </div>
        );
      })}
      <div className="grid-overlay"></div>
    </div>
  );
};

export default GridTransitionBackground;
