import React from 'react';
import CardView from './cardview';

class PileView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pile = this.props.pile;
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
