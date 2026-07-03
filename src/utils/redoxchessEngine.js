class RedoxChessEngine {
  engine = null;
  onMoveCallback = null;
  _isReady = false;
  get isReady() {
    return this._isReady;
  }
  async init() {
    return new Promise((resolve) => {
      this.engine = new Worker("/redoxchess.js");
      this.engine.onmessage = (event) => {
        const message = event.data;
        if (message === "readyok") {
          this._isReady = true;
          resolve();
        } else if (message.startsWith("bestmove")) {
          const move = message.split(" ")[1];
          if (this.onMoveCallback) {
            this.onMoveCallback(move);
          }
        }
      };
      this.send("uci");
      this.send("isready");
    });
  }
  send(command) {
    if (this.engine) {
      this.engine.postMessage(command);
    }
  }
  setPosition(fen) {
    this.send(`position fen ${fen}`);
  }
  getBestMove(onMove, depth = 15) {
    this.onMoveCallback = onMove;
    this.send(`go depth ${depth}`);
  }
  stop() {
    this.send("stop");
  }
  quit() {
    if (this.engine) {
      this.send("quit");
      this.engine.terminate();
      this.engine = null;
    }
  }
}
var redoxchessEngine_default = RedoxChessEngine;
export {
  redoxchessEngine_default as default
};
