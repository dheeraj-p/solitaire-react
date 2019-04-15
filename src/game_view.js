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
        this.openLastCardOfPile(piles[pileNumber]);
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

  areOfDifferentColors(card1, card2) {
    return card1.getColor() !== card2.getColor();
  }

  doesCardMatch(card, rankToMatchWith, suiteToMatchWith) {
    return (
      card.getSuite() == suiteToMatchWith && card.getNumber() == rankToMatchWith
    );
  }

  isCardMoveable(targetCard, lastSelectedCard) {
    const isAlternateCard =
      this.areOfDifferentColors(targetCard, lastSelectedCard) &&
      targetCard.getNumber() == lastSelectedCard.getNumber() + 1;

    const isTargetANullCard = targetCard.getNumber() === 0;
    const isLastCardKing = lastSelectedCard.getNumber() === 13;
    const isKingOnEmptyPile = isTargetANullCard && isLastCardKing;
    return isAlternateCard || isKingOnEmptyPile;
  }

  openLastCardOfPile(pile) {
    const lastCard = _.last(pile);
    if (lastCard == undefined) {
      return;
    }
    lastCard.open();
  }

  getIndexOfCardInPile(card, pile) {
    return _.findIndex(pile, _card => card.equals(_card));
  }

  removeCardsInPileFrom(card, pile) {
    const indexOfCard = this.getIndexOfCardInPile(card, pile);
    return _.remove(pile, (card, index) => index >= indexOfCard);
  }

  removeNullCard(cards) {
    const nullCard = new Card('', 0);
    _.remove(cards, card => card.equals(nullCard));
  }

  moveCards(targetId, lastSelectedCardId) {
    const [targetCardSuite, targetCardRank, targetPileId] = targetId.split('_');
    const [lastCardSuite, lastCardRank, lastPileId] = lastSelectedCardId.split(
      '_'
    );

    const piles = [...this.state.piles];

    const targetCard = piles[targetPileId].find(card => {
      return this.doesCardMatch(card, targetCardRank, targetCardSuite);
    });

    const lastSelectedCard = piles[lastPileId].find(card => {
      return this.doesCardMatch(card, lastCardRank, lastCardSuite);
    });

    const lastSelectedCardPile = piles[lastPileId];
    const targetPile = piles[targetPileId];

    if (!this.isCardMoveable(targetCard, lastSelectedCard)) {
      return piles;
    }

    this.removeNullCard(targetPile);

    const removedCards = this.removeCardsInPileFrom(
      lastSelectedCard,
      lastSelectedCardPile
    );

    piles[targetPileId] = targetPile.concat(removedCards);

    this.openLastCardOfPile(lastSelectedCardPile);
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
