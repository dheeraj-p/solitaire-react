import React from 'react';
import Deck from './models/deck';
import _ from 'lodash';
import PileView from './pileview';
import Card from './models/card';

class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { deck: Deck.create(), lastSelectedCard: null };
  }

  initializePiles() {
    this.setState(state => {
      const piles = new Array(7);
      for (let pileNumber = 0; pileNumber < piles.length; pileNumber++) {
        piles[pileNumber] = state.deck.take(pileNumber + 1);
      }
      return { ...state, piles };
    });
  }

  componentWillMount() {
    this.initializePiles();
  }

  isACardAlreadySelected() {
    return this.state.lastSelectedCard != null;
  }

  moveCards(targetId, lastSelectedCardId) {
    const [targetCardSuite, targetCardRank, targetPileId] = targetId.split('_');
    const [lastCardSuite, lastCardRank, lastPileId] = lastSelectedCardId.split(
      '_'
    );

    const piles = [...this.state.piles];
    const lastSelectedCardPile = piles[lastPileId];
    const removedCards = _.remove(lastSelectedCardPile, card => {
      return (
        card.getSuite() == lastCardSuite && card.getNumber() == lastCardRank
      );
    });

    const targetPile = piles[targetPileId];
    piles[targetPileId] = targetPile.concat(removedCards);

    return piles;
  }

  handleClick(event) {
    const targetId = event.target.id;

    if (this.isACardAlreadySelected()) {
      const lastSelectedCardId = this.state.lastSelectedCard;
      const pilesWithMovedCards = this.moveCards(targetId, lastSelectedCardId);
      this.setState(state => {
        return { ...state, piles: pilesWithMovedCards, lastSelectedCard: null };
      });
      return;
    }

    this.setState(state => {
      return { ...state, lastSelectedCard: targetId };
    });
  }

  render() {
    const { piles } = this.state;

    return (
      <div className="tableau">
        {piles.map((pile, index) => {
          return (
            <PileView
              pile={pile}
              id={index}
              key={index}
              cardOnClick={this.handleClick.bind(this)}
              lastSelectedCard={this.state.lastSelectedCard}
            />
          );
        })}
      </div>
    );
  }
}

export default GameView;
