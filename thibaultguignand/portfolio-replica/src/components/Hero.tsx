import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Hero.css';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(
        [title1Ref.current, title2Ref.current],
        { y: 150, opacity: 0, rotateZ: 5 },
        {
          y: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.1,
          delay: 0.2
        }
      ).fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.8'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" ref={containerRef}>
      <div className="container">
        <div className="hero-content">
          <div className="text-reveal-wrapper">
            <h1 ref={title1Ref} className="hero-title">Creative</h1>
          </div>
          <div className="text-reveal-wrapper">
            <h1 ref={title2Ref} className="hero-title">Developer</h1>
          </div>
          <p ref={subtitleRef} className="hero-subtitle">
            Crafting immersive digital experiences through code and motion.
          </p>
        </div>
      </div>
      <div className="hero-background"></div>
    </section>
  );
};

export default Hero;
