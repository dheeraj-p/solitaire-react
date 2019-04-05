import React from 'react';
import './index.css';

class CardView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const style = { color: this.props.color };
    return (
      <div className="card-container" style={style}>
        <div className="card-content">
          {String.fromCodePoint(this.props.unicode)}
        </div>
      </div>
    );
  }
}

export default CardView;
