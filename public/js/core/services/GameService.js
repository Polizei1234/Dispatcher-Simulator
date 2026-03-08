/**
 * 🎮 GAME SERVICE
 * Service layer for game logic.
 */

const GameService = (store, eventBridge) => {
  const start = (mode) => {
    // Logic to start the game
    console.log('GameService: Starting game');
  };

  return {
    start,
  };
};

export default GameService;
