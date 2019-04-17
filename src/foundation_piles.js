import React from 'react';
import FoundationPile from './foundation_pile';

class FoundationPiles extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { piles } = this.props;

    const foundationPileViews = piles.map((pile, index) => {
      return (
        <FoundationPile
          pile={pile}
          id={index}
          key={index}
          onClickFoundationPile={this.props.onClickFoundationPile}
        />
      );
    });

    return (
      <div style={{ display: 'flex', marginRight: '25px' }}>
        {foundationPileViews}
      </div>
    );
  }
}

export default FoundationPiles;
