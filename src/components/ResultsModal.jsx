import PropTypes from 'prop-types'

function ResultsModal({ stats, onTryAgain }) {
  return (
    <div className="modal-overlay">
      <div className="stats-modal">
        <h2>Typing Results</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{stats.wpm}</span>
            <span className="stat-label">WPM</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.wrongWords.length}</span>
            <span className="stat-label">Mistakes</span>
          </div>
        </div>
        {stats.wrongWords.length > 0 && (
          <div className="mistakes-section">
            <h3>Words with Mistakes:</h3>
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