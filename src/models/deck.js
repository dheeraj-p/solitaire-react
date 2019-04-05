import _ from 'lodash';
import 'lodash.product';
import Card from './card';

class Deck {
  constructor(cards) {
    this.cards = cards;
  }

  static create() {
    const suites = ['spade', 'heart', 'diamond', 'club'];
    const numbers = _.range(1, 14);
    const cards = _.product(suites, numbers).map(
      ([suite, number]) => new Card(suite, number)
    );

    return new Deck(cards);
  }

  getCards() {
    return this.cards.map(card => new Card(card.getSuite(), card.getNumber()));
  }
}

export default Deck;