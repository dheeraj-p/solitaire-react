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
}

export default Card;
