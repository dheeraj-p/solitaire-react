import React from 'react';
import CardView from './cardview';

class PileView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pile = this.props.pile;
    const cardViews = pile.map(card => <CardView card={card} />);
    return <div className="pile">{cardViews}</div>;
  }
}

export default PileView;
