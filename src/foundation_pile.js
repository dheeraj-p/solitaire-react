import React from 'react';
import _ from 'lodash';
import CardView from './cardview';

class FoundationPile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pile } = this.props;
    const topCard = _.last(pile);
    return (
      <div style={{ marginRight: '10px' }}>
        <CardView
          card={topCard}
          id={this.props.id}
          nullCardOnClick={this.props.onClickFoundationPile}
          onClick={this.props.onClickFoundationPile}
        />
      </div>
    );
  }
}

export default FoundationPile;
