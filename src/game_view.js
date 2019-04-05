import React from 'react';
import Deck from './models/deck';
import CardView from './cardview';

class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { deck: Deck.create() };
  }

  getUnicode(card) {
    const unicodes = {
      heart: 127152,
      spade: 127136,
      diamond: 127168,
      club: 127184
    };

    const cardNumber = card.getNumber();
    const cardUnicodeNumber = cardNumber > 11 ? cardNumber + 1 : cardNumber;
    const unicodeInDecimal = unicodes[card.getSuite()] + cardUnicodeNumber;

    return unicodeInDecimal;
  }

  getSuiteColor(suite) {
    const suiteColors = {
      heart: 'red',
      spade: 'black',
      diamond: 'red',
      club: 'black'
    };
    return suiteColors[suite];
  }

  render() {
    const cards = this.state.deck.getCards();

    return (
      <div style={{ display: 'flex' }}>
        {cards.map(card => {
          const unicode = this.getUnicode(card);
          const color = this.getSuiteColor(card.getSuite());
          return <CardView unicode={unicode} color={color} />;
        })}
      </div>
    );
  }
}

export default GameView;
