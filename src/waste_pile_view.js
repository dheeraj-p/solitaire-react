import React from 'react';
import CardView from './cardview';
import _ from 'lodash';

class WastePileView extends React.Component {
  constructor(props) {
    super(props);
  }

  getCardId(card) {
    return `${card.getSuite()}_${card.getNumber()}_${this.props.id}`;
  }

  render() {
    const allCards = this.props.cards;
    const lastOpenedCard = _.last(allCards.openedCards);
    const lastClosedCard = _.last(allCards.closedCards);

    const lastOpenedCardId = this.getCardId(lastOpenedCard);
    const isSelected = lastOpenedCardId == this.props.lastSelectedCard;

    return (
      <div style={{ display: 'flex', marginLeft: '45px' }}>
        <div style={{ marginRight: '10px' }}>
          <CardView
            card={lastClosedCard}
            onClickClosedCard={this.props.onClickDeck}
            nullCardOnClick={this.props.onClickEmptyDeck}
          />
        </div>
        <div>
          <CardView
            card={lastOpenedCard}
            id={lastOpenedCardId}
            key={lastOpenedCardId}
            onClick={this.props.onClickedWastePileOpenedCard}
            nullCardOnClick={null}
            isSelected={isSelected}
          />
        </div>
        <div />
      </div>
    );
  }
}

export default WastePileView;
