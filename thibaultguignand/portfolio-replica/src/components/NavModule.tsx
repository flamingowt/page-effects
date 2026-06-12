import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './NavModule.css';

gsap.registerPlugin(useGSAP);

interface NavModuleProps {
  id: string;
  title: string;
  category: string;
  indexNum: number;
  tags: string[];
  positionClass: string;
  onHover: (id: string) => void;
}

const NavModule = ({ title, category, indexNum, tags, positionClass, onHover, id }: NavModuleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseEnter = contextSafe(() => {
    onHover(id);
    if (borderRef.current) {
      gsap.to(borderRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
    }
  });

  const handleMouseLeave = contextSafe(() => {
    if (borderRef.current) {
      gsap.to(borderRef.current, { scale: 1.1, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  });

  return (
    <div 
      className={`nav-module ${positionClass}`} 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="nav-content">
        <h3 className="nav-title">{title}</h3>
        <div className="nav-details">
          <span>{tags[0]}</span>
          <div className="diamond-index">
            <span className="diamond"></span>
            <span className="num">{indexNum}</span>
          </div>
          <span>{tags[1]}</span>
        </div>
        <p className="nav-category">{category}</p>
      </div>
      <div className="hover-corners" ref={borderRef}>
        <div className="corner top-left-corner"></div>
        <div className="corner top-right-corner"></div>
        <div className="corner bottom-left-corner"></div>
        <div className="corner bottom-right-corner"></div>
      </div>
    </div>
  );
};

export default NavModule;
