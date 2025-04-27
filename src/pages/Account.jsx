import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import css from './Account.module.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Account = () => {
  const { currentUser, userData, setUserData } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState({
    statistics: true,
    activity: false,
    preferences: false
  });

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
    } else {
      root.style.setProperty('--text-color', 'var(--dark-color)');
      root.style.setProperty('--background-color', 'var(--light-color)');
      root.style.setProperty('--card-bg-color', 'var(--light-color-active)');
      root.style.setProperty('--card-shadow', 'var(--box-shadow-light)');
      root.style.setProperty('--card-shadow-hover', 'var(--box-shadow-light-hover)');
      root.style.setProperty('--button-bg', 'var(--button-bg-color-light)');
    }
  };

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            // If user hasn't set a theme preference, use OS preference
            if (!data.theme) {
              const osTheme = getOSTheme();
              await updateDoc(userRef, { theme: osTheme });
              setUserData({ ...data, theme: osTheme });
              updateThemeVariables(osTheme);
            } else {
              setUserData(data);
              updateThemeVariables(data.theme);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser, setUserData]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleHighlightModeChange = async (mode) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        highlightMode: mode
      });
      
      setUserData(prev => ({
        ...prev,
        highlightMode: mode
      }));
    } catch (error) {
      console.error('Error updating highlight mode:', error);
    }
  };

  const handleThemeChange = async (theme) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        theme: theme
      });
      
      setUserData(prev => ({
        ...prev,
        theme: theme
      }));

      // Update CSS variables when theme changes
      updateThemeVariables(theme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={css['account-container']}>
        <div className={css['loading-spinner']}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={css['account-header']}>
        <h1>Account Settings</h1>
        <div className={css['user-info']}>
          <div className={css['avatar-placeholder']}>
            {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase()}
          </div>
          <div className={css['user-details']}>
            <h2>{currentUser?.displayName || currentUser?.email}</h2>
            <p className={css['email']}>{currentUser?.email}</p>
          </div>
        </div>
      </div>

      <div className={css['account-sections']}>
        {/* Statistics Section */}
        <div className={css['account-section']}>
          <div 
            className={css['section-header']}
            onClick={() => toggleSection('statistics')}
          >
            <h2>Statistics</h2>
            <span className={`${css['arrow']} ${expandedSections.statistics ? css['expanded'] : ''}`}>▼</span>
          </div>
          {expandedSections.statistics && (
            <div className={css['section-content']}>
              <div className={css['stats-grid']}>
                <div className={css['stat-item']}>
                  <div className={css['stat-value']}>{userData?.totalTests || 0}</div>
                  <div className={css['stat-label']}>Total Tests</div>
                </div>
                <div className={css['stat-item']}>
                  <div className={css['stat-value']}>{userData?.averageWPM?.toFixed(1) || 0}</div>
                  <div className={css['stat-label']}>Average WPM</div>
                </div>
                <div className={css['stat-item']}>
                  <div className={css['stat-value']}>{userData?.bestWPM || 0}</div>
                  <div className={css['stat-label']}>Best WPM</div>
                </div>
                <div className={css['stat-item']}>
                  <div className={css['stat-value']}>{userData?.averageAccuracy?.toFixed(1) || 0}%</div>
                  <div className={css['stat-label']}>Average Accuracy</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Section */}
        <div className={css['account-section']}>
          <div 
            className={css['section-header']}
            onClick={() => toggleSection('activity')}
          >
            <h2>Recent Activity</h2>
            <span className={`${css['arrow']} ${expandedSections.activity ? css['expanded'] : ''}`}>▼</span>
          </div>
          {expandedSections.activity && (
            <div className={css['section-content']}>
              <div className={css['activity-list']}>
                {userData?.recentTests?.slice(-10).reverse().map((test, index) => (
                  <div key={index} className={css['activity-item']}>
                    <div className={css['activity-date']}>
                      {new Date(test.timestamp).toLocaleDateString()} at{' '}
                      {new Date(test.timestamp).toLocaleTimeString()}
                    </div>
                    <div className={css['activity-stats']}>
                      {test.wpm} WPM • {test.accuracy}% accuracy
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preferences Section */}
        <div className={css['account-section']}>
          <div 
            className={css['section-header']}
            onClick={() => toggleSection('preferences')}
          >
            <h2>Preferences</h2>
            <span className={`${css['arrow']} ${expandedSections.preferences ? css['expanded'] : ''}`}>▼</span>
          </div>
          {expandedSections.preferences && (
            <div className={css['section-content']}>
              <div className={css['preferences-list']}>
                <div className={css['preference-item']}>
                  <span className={css['preference-label']}>Theme</span>
                  <div className={css['radio-group']}>
                    <label className={css['radio-label']}>
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={userData?.theme === 'light'}
                        onChange={(e) => handleThemeChange('light')}
                      />
                      <span>Light</span>
                    </label>
                    <label className={css['radio-label']}>
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={userData?.theme === 'dark'}
                        onChange={(e) => handleThemeChange('dark')}
                      />
                      <span>Dark</span>
                    </label>
                  </div>
                </div>
                <div className={css['preference-item']}>
                  <span className={css['preference-label']}>Sound Effects</span>
                  <span className={css['preference-value']}>On</span>
                </div>
                <div className={css['preference-item']}>
                  <span className={css['preference-label']}>Keyboard Layout</span>
                  <span className={css['preference-value']}>QWERTY</span>
                </div>
                <div className={css['preference-item']}>
                  <span className={css['preference-label']}>Highlight Mode</span>
                  <div className={css['radio-group']}>
                    <label className={css['radio-label']}>
                      <input
                        type="radio"
                        name="highlightMode"
                        value="letters"
                        checked={userData?.highlightMode === 'words' ? false : true}
                        onChange={(e) => handleHighlightModeChange('letters')}
                      />
                      <span>Letters</span>
                    </label>
                    <label className={css['radio-label']}>
                      <input
                        type="radio"
                        name="highlightMode"
                        value="words"
                        checked={userData?.highlightMode === 'words'}
                        onChange={(e) => handleHighlightModeChange('words')}
                      />
                      <span>Words</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account; 