const initialState = {
  deck: {
    current: {
      filename: null,
      openAt: 0,
      cardsConfig: {},
      cards: [],
      effects: [],
      resources: {},
      exportConfig: {
        cardsQuantity: {}
      },
      updated: false,
      version: '1.0.2'
    },
    edited: {
      card: {},
      effect: {}
    }
  },
  availableFonts: []
};

export default initialState;
