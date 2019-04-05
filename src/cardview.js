import React from 'react';
import './index.css';

class CardView extends React.Component {
  constructor(props) {
    super(props);
  }

  getUnicode() {
    const unicodes = {
      heart: 127152,
      spade: 127136,
      diamond: 127168,
      club: 127184
    };

    const card = this.props.card;
    const cardNumber = card.getNumber();
    const cardUnicodeNumber = cardNumber > 11 ? cardNumber + 1 : cardNumber;
    const unicodeInDecimal = unicodes[card.getSuite()] + cardUnicodeNumber;

    return unicodeInDecimal;
  }

  getColor() {
    const suiteColors = {
      heart: 'red',
      spade: 'black',
      diamond: 'red',
      club: 'black'
    };
    return suiteColors[this.props.card.getSuite()];
  }

  render() {
    const style = { color: this.getColor() };
    return (
      <div className="card-container" style={style}>
        <div className="card-content">
          {String.fromCodePoint(this.getUnicode())}
        </div>
      </div>
    );
  }
}

export default CardView;
