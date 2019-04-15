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

  render() {
    const style = { color: this.props.card.getColor() };
    let className = 'card-container';
    if (this.props.isSelected) {
      className += ' selected-card';
    }
    return (
      <div
        className={className}
        style={style}
        id={this.props.id}
        onClick={this.props.onClick}
      >
        {String.fromCodePoint(this.getUnicode())}
      </div>
    );
  }
}

export default CardView;
