import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    id: 1,
    title: 'Neon Void',
    category: 'WebGL Experience',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Aura',
    category: 'E-commerce Redefined',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Prism',
    category: 'Creative Portfolio',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000&auto=format&fit=crop',
  }
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.project-item');
      
      items.forEach((item) => {
        const image = item.querySelector('.project-image-inner');
        
        gsap.to(image, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section projects-section" ref={containerRef}>
      <div className="container">
        <h2 className="section-title">Selected Works</h2>
        <div className="projects-list">
          {projectsData.map((project) => (
            <div key={project.id} className="project-item">
              <div className="project-image-container">
                <div 
                  className="project-image-inner" 
                  style={{ backgroundImage: `url(${project.image})` }}
                ></div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
