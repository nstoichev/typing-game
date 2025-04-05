import PropTypes from 'prop-types'
import './ResultsModal.css'

function ResultsModal({ stats, onTryAgain }) {
  return (
    <div className="modal-overlay">
      <div className="stats-modal">
        <h2>Typing Results</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{stats.wpm}</div>
            <div className="stat-label">WPM</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.wrongWords.length}</div>
            <div className="stat-label">Mistakes</div>
          </div>
        </div>
        {stats.wrongWords.length > 0 && (
          <div className="mistakes-section">
            <h3>Words to Practice</h3>
            <div className="wrong-words-list">
              {stats.wrongWords.map((word, index) => (
                <span key={index} className="wrong-word">{word}</span>
              ))}
            </div>
          </div>
        )}
        <button className="try-again-button" onClick={onTryAgain}>
          Try Again
        </button>
      </div>
    </div>
  )
}

ResultsModal.propTypes = {
  stats: PropTypes.shape({
    wpm: PropTypes.number.isRequired,
    accuracy: PropTypes.number.isRequired,
    wrongWords: PropTypes.array.isRequired
  }).isRequired,
  onTryAgain: PropTypes.func.isRequired
}

export default ResultsModal 