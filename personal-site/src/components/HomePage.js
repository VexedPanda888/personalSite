import React from 'react';
import Graph from './Graph';
import '../styles/App.css';

function HomePage() {
  const nodes = [
    { id: 1, label: 'LinkedIn', url: 'https://www.linkedin.com/in/connor-w-hay/', color: '#0077b5', x:0, y:0, type: 'external' }, // LinkedIn blue
    { id: 2, label: 'GitHub', url: 'https://github.com/VexedPanda888', color: '#333', x:0, y:0, type: 'external' }, // GitHub black
    { id: 3, label: 'Go/Baduk/Weiqi', url: '/go', color: '#f06529', x:0, y:0 }, // Using a fun color for hobbiesv
    { id: 4, label: 'Problem Solving', url: null,  color: 'gray', x:0, y:0 },
    { id: 5, label: 'Climbing Coaching', url: '/coaching', color: '#d1001f', x:0, y:0 },
    { id: 6, label: 'Leadership', url: null, color: 'gray', x:0, y:0 },
    { id: 7, label: 'Teaching', url: null, color: 'gray', x:0, y:0 },
    { id: 8, label: 'Data Science', url: null, color: 'gray', x:0, y:0 },
    { id: 9, label: 'Neuroscience', url: null, color: 'gray', x:0, y:0 },
    { id: 10, label: 'Machine Learning', url: null, color: 'gray', x:0, y:0 },
  ];

  // If nodes were to link to each other, define links here
  const links = [
    // { source: 1, target: 2 }, // Example link, not needed right now
    {source: 3, target: 4}
  ];

  return (
    <div className="App">
      <header>
        <Graph nodes={nodes} links={links} />
      </header>
    </div>
  );
}

export default HomePage;
