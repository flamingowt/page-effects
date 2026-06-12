import { useState } from 'react';
import GlitchText from './components/GlitchText';
import GridTransitionBackground from './components/GridTransitionBackground';
import NavModule from './components/NavModule';

const projects = [
  {
    id: 'default',
    title: 'ATYPICA',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2564&auto=format&fit=crop' // abstract cyber wave
  },
  {
    id: 'stratus',
    title: 'STRATUS, SCENOGRAPHY STUDIO',
    category: 'FRONT & BACK-END DEVELOPMENT',
    indexNum: 1,
    tags: ['FREELANCE', 'WEB & MOBILE'],
    positionClass: 'top-left',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
  },
  {
    id: 'metropole',
    title: 'METROPOLE, ADVERTISING NETWORK',
    category: 'FRONT & BACK-END DEVELOPMENT',
    indexNum: 2,
    tags: ['FREELANCE', 'WEB & MOBILE'],
    positionClass: 'top-center',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2564&auto=format&fit=crop'
  },
  {
    id: 'acheter',
    title: 'ACHETERduNEUF, NEW PROPERTY',
    category: 'FRONT-END DEVELOPMENT',
    indexNum: 3,
    tags: ['EMPLOYED', 'WEB APP'],
    positionClass: 'top-right',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2564&auto=format&fit=crop'
  },
  {
    id: 'vickies',
    title: 'VICKIES, SUPER FRESH AGENCY',
    category: 'FRONT-END DEVELOPMENT',
    indexNum: 4,
    tags: ['EMPLOYED', 'WEB'],
    positionClass: 'bottom-left',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2564&auto=format&fit=crop'
  },
  {
    id: 'adn',
    title: 'ADN FAMILY, METAVERSE ECOSYSTEM',
    category: 'FRONT-END DEVELOPMENT',
    indexNum: 5,
    tags: ['EMPLOYED', 'WEB & MOBILE'],
    positionClass: 'bottom-center',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2564&auto=format&fit=crop'
  },
  {
    id: 'atypica-site',
    title: 'ATYPICA, WHERE WEB MEETS ORIGINALITY',
    category: 'DESIGN & DEVELOPMENT',
    indexNum: 6,
    tags: ['PERSONAL', 'WEB & MOBILE'],
    positionClass: 'bottom-right',
    image: 'https://images.unsplash.com/photo-1614850715649-1d0106293cb1?q=80&w=2564&auto=format&fit=crop'
  }
];

function App() {
  const [activeProjectId, setActiveProjectId] = useState('default');

  const handleHover = (id: string) => {
    setActiveProjectId(id);
  };

  const handleMouseLeaveGlobal = () => {
    setActiveProjectId('default');
  };

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  return (
    <div className="app-container" onMouseLeave={handleMouseLeaveGlobal}>
      <GridTransitionBackground currentImage={activeProject.image} />
      
      <div className="nav-modules">
        {projects.filter(p => p.id !== 'default').map(p => (
          <NavModule 
            key={p.id}
            id={p.id}
            title={p.title}
            category={p.category || ''}
            indexNum={p.indexNum || 0}
            tags={p.tags || []}
            positionClass={p.positionClass || ''}
            onHover={handleHover}
          />
        ))}
      </div>

      <GlitchText text={activeProjectId === 'default' ? 'Atypica' : activeProject.title.split(',')[0]} />
    </div>
  );
}

export default App;
