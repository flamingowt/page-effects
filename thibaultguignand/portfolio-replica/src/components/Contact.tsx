import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import './Contact.css';

const Contact: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = (e.clientX - rect.left) - rect.width / 2;
      const y = (e.clientY - rect.top) - rect.height / 2;

      gsap.to(button, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.6,
        ease: 'power3.out'
      });
      
      gsap.to(text, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.6,
        ease: 'power3.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to([button, text], {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <footer className="section contact-section">
      <div className="container contact-container">
        <h2 className="contact-title">Let's build something <br/> extraordinary.</h2>
        
        <div className="contact-action">
          <button ref={buttonRef} className="magnetic-button">
            <span ref={textRef} className="button-text">
              Get in touch <ArrowUpRight size={24} />
            </span>
          </button>
        </div>

        <div className="contact-footer">
          <p>© {new Date().getFullYear()} Creative Developer</p>
          <div className="social-links">
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
