import { createContext, useState, useContext } from 'react';

export const PageTransitionContext = createContext();

export const PageTransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('forward'); // 'forward' or 'backward'

  const startTransition = (direction = 'forward') => {
    setTransitionDirection(direction);
    setIsTransitioning(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTransitioning(false);
        resolve();
      }, 600); // Duración de la transición en ms
    });
  };

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, transitionDirection, startTransition }}>
      {children}
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => useContext(PageTransitionContext);
