import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useTheme = () => {
  const { userData } = useAuth();

  // Get OS theme preference
  const getOSTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Update CSS variables based on theme
  const updateThemeVariables = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--text-color', 'var(--light-color)');
      root.style.setProperty('--background-color', 'var(--dark-color)');
      root.style.setProperty('--card-bg-color', 'var(--dark-color-active)');
      root.style.setProperty('--card-shadow', 'var(--box-shadow-dark)');
      root.style.setProperty('--card-shadow-hover', 'var(--box-shadow-dark-wide)');
      root.style.setProperty('--button-bg', '#444');
      root.style.setProperty('--input-bg-color', 'var(--dark-color-active)');
    } else {
      root.style.setProperty('--text-color', 'var(--dark-color)');
      root.style.setProperty('--background-color', 'var(--light-color)');
      root.style.setProperty('--card-bg-color', 'var(--light-color-active)');
      root.style.setProperty('--card-shadow', 'var(--box-shadow-light)');
      root.style.setProperty('--card-shadow-hover', 'var(--box-shadow-light-hover)');
      root.style.setProperty('--button-bg', 'var(--button-bg-color-light)');
      root.style.setProperty('--input-bg-color', 'var(--light-color-active)');
    }
  };

  useEffect(() => {
    // If user is logged in and has a theme preference, use it
    if (userData?.theme) {
      updateThemeVariables(userData.theme);
    } else {
      // Otherwise use OS preference
      const osTheme = getOSTheme();
      updateThemeVariables(osTheme);
    }
  }, [userData?.theme]);

  return { updateThemeVariables };
}; 