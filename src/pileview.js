import React from 'react';
import CardView from './cardview';
import Card from './models/card';

class PileView extends React.Component {
  constructor(props) {
    super(props);
  }

  isPileEmpty() {
    return this.props.pile.length == 0;
  }

  render() {
    const pile = this.props.pile;
    if (this.isPileEmpty()) {
      const nullCard = new Card('', 0);
      pile.push(nullCard);
    }

    const cardViews = pile.map(card => {
      const id = `${card.getSuite()}_${card.getNumber()}_${this.props.id}`;

      const isSelected = id == this.props.lastSelectedCard;
      return (
        <CardView
          card={card}
          key={id}
          id={id}
          onClick={this.props.cardOnClick}
          isSelected={isSelected}
        />
      );
    });
    return <div className="pile">{cardViews}</div>;
  }
}

export default PileView;
