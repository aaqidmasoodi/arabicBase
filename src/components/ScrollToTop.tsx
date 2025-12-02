import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll window (for PublicLayout where body scrolls)
        window.scrollTo(0, 0);

        // Scroll main container (for Layout where main element scrolls)
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
            mainContainer.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
};
