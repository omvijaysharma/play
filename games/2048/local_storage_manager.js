// Fake Storage in case LocalStorage is not supported
window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

// LocalStorage Manager
function LocalStorageManager() {
  this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameState";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

// Check if localStorage is supported
LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);

  // Update the best-container-main element
  document.querySelector(".best-container-main").textContent = score;
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};

// Initialize the game and set the best score on page load
document.addEventListener("DOMContentLoaded", function () {
  var localStorageManager = new LocalStorageManager();
  var bestScore = localStorageManager.getBestScore();
  
  // Set the initial value for best-container-main
  document.querySelector(".best-container-main").textContent = bestScore;
  
  // You can add more game initialization code here if necessary
});

// Assuming `localStorageManager` is instantiated elsewhere in your game logic

function reScore() {
  var localStorageManager = new LocalStorageManager(); // Instantiate the LocalStorageManager
  localStorageManager.setBestScore(0); // Reset the best score to 0
}