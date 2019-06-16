const isDev = require('electron-is-dev');
const i18n = require('../constants/i18n');

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function menuRole(role, accelerator) {
  return {
    role,
    accelerator,
    label: i18n.t(`electron.menu.${role}`),
  };
}

const languagesNames = {
  en: 'English',
  fr: 'Français',
}

module.exports = sendAppEvent => {
  const menuLabelWithEvent = (label, accelerator) => {
    const name = camelize(label);
    return {
      label,
      accelerator,
      click: () => sendAppEvent(name)
    };
  };

  const menuTemplate = [
    {
      label: i18n.t('electron.menu.file'),
      submenu: [
        menuLabelWithEvent(i18n.t('electron.menu.new'), 'CmdOrCtrl+N'),
        menuLabelWithEvent(i18n.t('electron.menu.open'), 'CmdOrCtrl+O'),
        menuLabelWithEvent(i18n.t('electron.menu.save'), 'CmdOrCtrl+S'),
        menuLabelWithEvent(i18n.t('electron.menu.saveAs'), 'Shift+CmdOrCtrl+S'),
        {type: 'separator'},
        menuLabelWithEvent(i18n.t('electron.menu.exportAsPDF'), 'CmdOrCtrl+E'),
        {type: 'separator'},
        menuRole('quit', 'Alt+F4'),
      ]
    },
    {
      label: i18n.t('electron.menu.view'),
      submenu: [
        menuRole('resetZoom'),
        menuRole('zoomIn'),
        menuRole('zoomOut'),
      ]
    },
    {
      label: i18n.t('electron.menu.settings'),
      submenu: [
        {
          label: i18n.t('electron.menu.language'),
          submenu: i18n.availableLanguages.map(code => ({
            label: languagesNames[code],
            type: 'radio',
            checked: i18n.language === code,
            click: () => i18n.changeLanguage(code),
          })),
        }
      ]
    },
  ];

  if (isDev) {
    menuTemplate.push({
      label: i18n.t('electron.menu.devTools'),
      submenu: [
        menuRole('reload'),
        menuRole('forceReload'),
        menuRole('toggleDevTools'),
      ]
    });
  }

  return menuTemplate;
};
