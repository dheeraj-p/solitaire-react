import Card from './card';

class Game {
  constructor(deck) {
    this.deck = deck;
  }

  initializePiles() {
    this.piles = new Array(7);
    for (let pileNumber = 0; pileNumber < this.piles.length; pileNumber++) {
      this.piles[pileNumber] = this.deck.take(pileNumber + 1);
    }
  }

  getAllPiles() {
    return this.piles.map(pile =>
      pile.map(card => new Card(card.getSuite(), card.getNumber()))
    );
  }
}

export default Game;
