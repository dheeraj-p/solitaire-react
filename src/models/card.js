class Card {
  constructor(suite, number) {
    this.suite = suite;
    this.number = number;
  }

  getSuite() {
    return this.suite;
  }

  getNumber() {
    return this.number;
  }

  getColor() {
    const suiteColors = {
      heart: 'red',
      spade: 'black',
      diamond: 'red',
      club: 'black'
    };
    return suiteColors[this.suite];
  }

  equals(anotherCard) {
    return this.number == anotherCard.number && this.suite == anotherCard.suite;
  }
}

export default Card;
