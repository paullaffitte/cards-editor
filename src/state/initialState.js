const initialState = {
  deck: {
    current: {
      filename: null,
      cardsConfig: {},
      cards: [],
      effects: [],
      resources: {},
      exportConfig: {
        cardsQuantity: {}
      }
    },
    edited: {
      card: {},
      effect: {}
    }
  }
};

export default initialState;
