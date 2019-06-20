const makeMm = (width, height) => ({ width, height });

const dpiBase = 95.8; // constant when exporting with chrome (empirical constatation)
const paper = {
  A4: makeMm(297, 210),
};

const mmToIn = mm => mm / 25.4;
const inToPx = inch => inch * dpiBase;
const mmToPx = mm => inToPx(mmToIn(mm));

const calcScale = dpi => dpiBase / dpi;

export {
  paper,
  makeMm,
  mmToIn,
  mmToPx,
  inToPx,
  calcScale,
};
