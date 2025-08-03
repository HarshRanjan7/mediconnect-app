// File Path: frontend/src/hooks/useScrollAnimate.js

import { useEffect, useRef } from 'react';

// This custom hook will add a 'visible' class to an element when it scrolls into view
export const useScrollAnimate = () => {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        // Cleanup observer on component unmount
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    // We also need to add the base styles for the animation
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      }
      .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);


    return ref;
};
