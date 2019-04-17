import React from 'react';
import Deck from './models/deck';
import _ from 'lodash';
import PileView from './pileview';
import Card from './models/card';
import WastePileView from './waste_pile_view';
import FoundationPiles from './foundation_piles';

class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: Deck.create(),
      lastSelectedCardId: null,
      wastePileCards: { openedCards: [], closedCards: [] },
      foundationPiles: []
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

  initializeFoundationPiles() {
    this.setState(state => {
      state.foundationPiles = new Array(4).fill(null).map(e => {
        return new Array(1).fill(new Card('', 0));
      });
    });
  }

  componentWillMount() {
    this.initializePiles();
    this.initializeWastePile();
    this.initializeFoundationPiles();
  }

  isACardAlreadySelected() {
    return this.state.lastSelectedCardId != null;
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

    const isLastCardKing = lastSelectedCard.isKing();
    const isKingOnEmptyPile = targetCard.isNullCard() && isLastCardKing;
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

  moveCardFromWastePileTo(pile, card) {
    const lastSelectedCard = _.last(this.state.wastePileCards.openedCards);

    if (this.isCardMoveable(card, lastSelectedCard)) {
      this.state.wastePileCards.openedCards.pop();
      pile.push(lastSelectedCard);
      this.removeNullCard(pile);
    }
  }

  isLargeSelectedCardInTableau() {
    return !this.isLastSelectedCardInWastePile();
  }

  canCardBeMovedToFoudationPile(
    foundationPileId,
    cardToMovePileId,
    cardToMove
  ) {
    const cardToMovePile = this.state.piles[cardToMovePileId];
    const isCardToMoveOnTopOfPile = _.last(cardToMovePile).equals(cardToMove);

    if (!isCardToMoveOnTopOfPile) return false;

    const foundatioPile = this.state.foundationPiles[foundationPileId];
    const topCard = _.last(foundatioPile);
    if (topCard.isNullCard() && cardToMove.isAce()) return true;

    const isRankOneMoreThanTopCard =
      topCard.getNumber() == cardToMove.getNumber() - 1;
    const isOfSameSuite = topCard.getSuite() == cardToMove.getSuite();
    if (isRankOneMoreThanTopCard && isOfSameSuite) return true;

    return false;
  }

  moveCardToFoundationFile(foundationPileId, cardToMovePileId, cardToMove) {
    this.setState(state => {
      const cardToMovePile = state.piles[cardToMovePileId];
      cardToMovePile.pop();

      const foundatioPile = state.foundationPiles[foundationPileId];
      foundatioPile.push(cardToMove);
      return state;
    });
  }

  onClickFoundationPile(event) {
    if (!this.isACardAlreadySelected()) return;
    if (!this.isLargeSelectedCardInTableau()) return;

    const foundationPileId = event.target.id;

    const [
      cardToMoveSuite,
      cardToMoveRank,
      cardToMovePileId
    ] = this.state.lastSelectedCardId.split('_');

    const cardToMove = this.findCardInTableauPile(
      cardToMovePileId,
      cardToMoveRank,
      cardToMoveSuite
    );
    if (
      this.canCardBeMovedToFoudationPile(
        foundationPileId,
        cardToMovePileId,
        cardToMove
      )
    ) {
      this.moveCardToFoundationFile(
        foundationPileId,
        cardToMovePileId,
        cardToMove
      );

      this.setState(state => {
        this.openLastCardOfPile(state.piles[cardToMovePileId]);
        return { ...state, lastSelectedCardId: null };
      });
    }
  }

  findCardInTableauPile(pileId, cardRank, cardSuite) {
    return this.state.piles[pileId].find(card => {
      return this.doesCardMatch(card, cardRank, cardSuite);
    });
  }

  moveCards(targetId, lastSelectedCardId) {
    const [targetCardSuite, targetCardRank, targetPileId] = targetId.split('_');
    const [lastCardSuite, lastCardRank, lastPileId] = lastSelectedCardId.split(
      '_'
    );

    const piles = [...this.state.piles];
    const lastSelectedCardPile = piles[lastPileId];
    const targetPile = piles[targetPileId];

    const targetCard = this.findCardInTableauPile(
      targetPileId,
      targetCardRank,
      targetCardSuite
    );

    if (this.isLastSelectedCardInWastePile()) {
      this.moveCardFromWastePileTo(targetPile, targetCard);
      return piles;
    }

    const lastSelectedCard = this.findCardInTableauPile(
      lastPileId,
      lastCardRank,
      lastCardSuite
    );

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
      const lastSelectedCardId = this.state.lastSelectedCardId;

      const pilesWithMovedCards = this.moveCards(targetId, lastSelectedCardId);
      this.setState(state => {
        return {
          ...state,
          piles: pilesWithMovedCards,
          lastSelectedCardId: null
        };
      });
      return;
    }

    this.setState(state => {
      return {
        ...state,
        lastSelectedCardId: targetId,
        lastSelectedCardSource: 'TABLEAU_PILE'
      };
    });
  }

  onClickDeck() {
    this.setState(state => {
      const cardToOpen = state.wastePileCards.closedCards.pop();
      cardToOpen.open();
      state.wastePileCards.openedCards.push(cardToOpen);
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
      lastSelectedCardId: event.target.id,
      lastSelectedCardSource: 'WASTE_PILE'
    });
  }

  render() {
    const { piles } = this.state;

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '120px'
          }}
        >
          <WastePileView
            cards={this.state.wastePileCards}
            lastSelectedCard={this.state.lastSelectedCardId}
            onClickDeck={this.onClickDeck.bind(this)}
            onClickEmptyDeck={this.onClickEmptyDeck.bind(this)}
            onClickedWastePileOpenedCard={this.onClickedWastePileOpenedCard.bind(
              this
            )}
          />
          <FoundationPiles
            piles={this.state.foundationPiles}
            onClickFoundationPile={this.onClickFoundationPile.bind(this)}
          />
        </div>
        <div className="tableau">
          {piles.map((pile, index) => {
            return (
              <PileView
                pile={pile}
                id={index}
                key={index}
                cardOnClick={this.onClickTableauCard.bind(this)}
                lastSelectedCard={this.state.lastSelectedCardId}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default GameView;
