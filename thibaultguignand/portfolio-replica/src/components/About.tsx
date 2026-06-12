import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation logic for scroll reveal
      if (textRef.current) {
        const text = textRef.current.innerText;
        textRef.current.innerHTML = '';
        
        const words = text.split(' ');
        words.forEach(word => {
          const span = document.createElement('span');
          span.innerText = word + ' ';
          span.className = 'about-word';
          textRef.current?.appendChild(span);
        });

        gsap.fromTo('.about-word', 
          { opacity: 0.2, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 50%',
              scrub: 1
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section about-section" ref={sectionRef}>
      <div className="container">
        <p ref={textRef} className="about-text">
          I bridge the gap between design and engineering. Focusing on fluid animations, modern aesthetics, and performant web technologies to create experiences that leave a lasting impression.
        </p>
      </div>
    </section>
  );
};

export default About;
