export default function Page() {
  return (
    <>
      <h1>Memory Card Game</h1>
      <div className="game-container">
        <div className="memory-grid">
          {/* Cards will be rendered here */}
          <div className="card">
            <div className="card-inner">
              <div className="card-front"></div>
              <div className="card-back"></div>
            </div>
          </div>
        </div>
        <div className="game-info">
          <div className="score">Score: 0</div>
          <div className="moves">Moves: 0</div>
          <button className="restart-btn">Restart Game</button>
        </div>
      </div>
    </>
  );
}
