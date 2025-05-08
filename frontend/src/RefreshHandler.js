import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth';

function RefreshHandler({setIsAuthenticated}) { 
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(isAuthenticated()) {
            setIsAuthenticated(true);
            if(
                location.pathname === '/' ||
                location.pathname === '/login' ||
                location.pathname === '/signup'
            ) {
                navigate('/home', {replace: false});
            }
        }
    }, [location, navigate, setIsAuthenticated]);
    
    return null;
}

export default RefreshHandler
