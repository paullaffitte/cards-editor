const fs = require('fs');

class MenuActions {

  static exportAsPDF(event, filename) {
    event.sender.printToPDF({
      marginsType: 1,
      pageSize: 'A4',
      printBackground: true,
      landscape: true
    }, (err, data) => {
      if (err) {
        event.sender.send('exportAsPDF-reply', { err });
        return;
      }
      try {
        fs.writeFileSync(filename, data);
        event.sender.send('exportAsPDF-reply', {});
      } catch (e) {
        event.sender.send('exportAsPDF-reply', { err: e });
      }
    });
  }
}

module.exports = MenuActions;
