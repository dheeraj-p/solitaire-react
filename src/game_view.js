import React from 'react';
import Deck from './models/deck';
import _ from 'lodash';
import PileView from './pileview';
import Card from './models/card';
import WastePileView from './waste_pile_view';

class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: Deck.create(),
      lastSelectedCard: null,
      wastePileCards: { openedCards: [], closedCards: [] }
    };
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

  initializeWastePile() {
    this.setState(state => {
      const nullCard = new Card('', 0);
      const openedCards = [nullCard];

      let closedCards = [nullCard];
      closedCards = closedCards.concat(state.deck.takeAll());

      return { ...state, wastePileCards: { openedCards, closedCards } };
    });
  }

  componentWillMount() {
    this.initializePiles();
    this.initializeWastePile();
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

  isLastSelectedCardInWastePile() {
    return this.state.lastSelectedCardSource == 'WASTE_PILE';
  }

  isNullCard(card) {
    return card.getNumber() === 0;
  }

  moveCardFromWastePileTo(pile, card) {
    const lastSelectedCard = _.last(this.state.wastePileCards.openedCards);

    if (this.isCardMoveable(card, lastSelectedCard)) {
      this.state.wastePileCards.openedCards.pop();
      pile.push(lastSelectedCard);
      this.removeNullCard(pile);
    }
  }

  moveCards(targetId, lastSelectedCardId) {
    const [targetCardSuite, targetCardRank, targetPileId] = targetId.split('_');
    const [lastCardSuite, lastCardRank, lastPileId] = lastSelectedCardId.split(
      '_'
    );

    const piles = [...this.state.piles];
    const lastSelectedCardPile = piles[lastPileId];
    const targetPile = piles[targetPileId];

    const targetCard = piles[targetPileId].find(card => {
      return this.doesCardMatch(card, targetCardRank, targetCardSuite);
    });

    if (this.isLastSelectedCardInWastePile()) {
      this.moveCardFromWastePileTo(targetPile, targetCard);
      return piles;
    }

    const lastSelectedCard = piles[lastPileId].find(card => {
      return this.doesCardMatch(card, lastCardRank, lastCardSuite);
    });

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

  onClickTableauCard(event) {
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
      return {
        ...state,
        lastSelectedCard: targetId,
        lastSelectedCardSource: 'TABLEAU_PILE'
      };
    });
  }

  onClickDeck() {
    this.setState(state => {
      const cardToOpen = state.wastePileCards.closedCards.pop();
      cardToOpen.open();
      state.wastePileCards.openedCards.push(cardToOpen);
      console.log('Aa rha h');
      return state;
    });
  }

  onClickEmptyDeck() {
    this.setState(state => {
      const openedCards = state.wastePileCards.openedCards;
      const closedCards = openedCards
        .splice(1, openedCards.length)
        .map(card => {
          card.close();
          return card;
        })
        .reverse();

      state.wastePileCards.closedCards = state.wastePileCards.closedCards.concat(
        closedCards
      );

      return state;
    });
  }

  onClickedWastePileOpenedCard(event) {
    this.setState({
      ...this.state,
      lastSelectedCard: event.target.id,
      lastSelectedCardSource: 'WASTE_PILE'
    });
  }

  render() {
    const { piles } = this.state;

    return (
      <div>
        <WastePileView
          cards={this.state.wastePileCards}
          lastSelectedCard={this.state.lastSelectedCard}
          onClickDeck={this.onClickDeck.bind(this)}
          onClickEmptyDeck={this.onClickEmptyDeck.bind(this)}
          onClickedWastePileOpenedCard={this.onClickedWastePileOpenedCard.bind(
            this
          )}
        />
        <div className="tableau">
          {piles.map((pile, index) => {
            return (
              <PileView
                pile={pile}
                id={index}
                key={index}
                cardOnClick={this.onClickTableauCard.bind(this)}
                lastSelectedCard={this.state.lastSelectedCard}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default GameView;
