class Card {
  constructor(suite, number) {
    this.suite = suite;
    this.number = number;
    this.opened = false;
  }

  getSuite() {
    return this.suite;
  }

  getNumber() {
    return this.number;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  isOpened() {
    return this.opened;
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

  isAce() {
    return this.number == 1;
  }

  isNullCard() {
    return this.number == 0;
  }

  isKing() {
    return this.number == 13;
  }
}

export default Card;
