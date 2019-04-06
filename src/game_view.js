import React from 'react';
import Deck from './models/deck';
import Game from './models/game';
import PileView from './pileview';

class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { game: new Game(Deck.create()), lastSelectedCard: null };
  }

  isACardAlreadySelected() {
    return this.state.lastSelectedCard != null;
  }

  handleClick(event) {
    const targetId = event.target.id;

    if (this.isACardAlreadySelected()) {
      const lastSelectedCardId = this.state.lastSelectedCard;
      this.setState(state => {
        return { ...state, lastSelectedCard: null };
      });
      return;
    }

    this.setState(state => {
      return { ...state, lastSelectedCard: targetId };
    });
  }

  componentWillMount() {
    this.state.game.initializePiles();
  }

  render() {
    const piles = this.state.game.getAllPiles();

    return (
      <div className="tableau">
        {piles.map(pile => (
          <PileView
            pile={pile}
            cardOnClick={this.handleClick.bind(this)}
            lastSelectedCard={this.state.lastSelectedCard}
          />
        ))}
      </div>
    );
  }
}

export default GameView;
