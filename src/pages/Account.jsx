import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Account.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Account = () => {
  const { currentUser, userData, setUserData } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState({
    statistics: true,
    activity: false,
    preferences: false
  });

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
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

  if (isLoading) {
    return (
      <div className="account-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>Account Settings</h1>
        <div className="user-info">
          <div className="avatar-placeholder">
            {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase()}
          </div>
          <div className="user-details">
            <h2>{currentUser?.displayName || currentUser?.email}</h2>
            <p className="email">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      <div className="account-sections">
        <div className="account-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('statistics')}
          >
            <h2>Statistics</h2>
            <span className={`arrow ${expandedSections.statistics ? 'expanded' : ''}`}>▼</span>
          </div>
          {expandedSections.statistics && (
            <div className="section-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{userData?.totalTests || 0}</div>
                  <div className="stat-label">Total Tests</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userData?.averageWPM?.toFixed(1) || 0}</div>
                  <div className="stat-label">Average WPM</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userData?.bestWPM || 0}</div>
                  <div className="stat-label">Best WPM</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userData?.averageAccuracy?.toFixed(1) || 0}%</div>
                  <div className="stat-label">Average Accuracy</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="account-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('activity')}
          >
            <h2>Recent Activity</h2>
            <span className={`arrow ${expandedSections.activity ? 'expanded' : ''}`}>▼</span>
          </div>
          {expandedSections.activity && (
            <div className="section-content">
              <div className="activity-list">
                {userData?.recentTests?.map((test, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-date">
                      {new Date(test.timestamp).toLocaleDateString()} at{' '}
                      {new Date(test.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="activity-stats">
                      {test.wpm} WPM • {test.accuracy}% accuracy
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="account-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('preferences')}
          >
            <h2>Preferences</h2>
            <span className={`arrow ${expandedSections.preferences ? 'expanded' : ''}`}>▼</span>
          </div>
          {expandedSections.preferences && (
            <div className="section-content">
              <div className="preferences-list">
                <div className="preference-item">
                  <span className="preference-label">Theme</span>
                  <span className="preference-value">Light</span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Sound Effects</span>
                  <span className="preference-value">On</span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Keyboard Layout</span>
                  <span className="preference-value">QWERTY</span>
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