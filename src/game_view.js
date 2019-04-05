import React from 'react';
import Deck from './models/deck';
import Game from './models/game';
import PileView from './pileview';

class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { game: new Game(Deck.create()) };
  }

  componentWillMount() {
    this.state.game.initializePiles();
  }

  render() {
    const piles = this.state.game.getAllPiles();

    return (
      <div className="tableau">
        {piles.map(pile => (
          <PileView pile={pile} />
        ))}
      </div>
    );
  }
}

export default GameView;
