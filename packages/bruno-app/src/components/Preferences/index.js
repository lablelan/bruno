import Modal from 'components/Modal/index';
import classnames from 'classnames';
import React, { useState } from 'react';

import Support from './Support';
import General from './General';
import Proxy from './ProxySettings';
import Display from './Display';
import Keybindings from './Keybindings';

import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const Preferences = ({ onClose }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('general');

  const getTabClassname = (tabName) => {
    return classnames(`tab select-none ${tabName}`, {
      active: tabName === tab
    });
  };

  const getTabPanel = (tab) => {
    switch (tab) {
      case 'general': {
        return <General close={onClose} />;
      }

      case 'proxy': {
        return <Proxy close={onClose} />;
      }

      case 'display': {
        return <Display close={onClose} />;
      }

      case 'keybindings': {
        return <Keybindings close={onClose} />;
      }

      case 'support': {
        return <Support />;
      }
    }
  };

  return (
    <StyledWrapper>
      <Modal size="lg" title="Preferences" handleCancel={onClose} hideFooter={true}>
        <div className='flex flex-row gap-2 mx-[-1rem] !my-[-1.5rem] py-2'>
          <div className="flex flex-col items-center tabs" role="tablist">
            <div className={getTabClassname('general')} role="tab" onClick={() => setTab('general')}>
              {t('Preferences.General')}
            </div>
            <div className={getTabClassname('display')} role="tab" onClick={() => setTab('display')}>{t('Preferences.Display')}</div>
            <div className={getTabClassname('proxy')} role="tab" onClick={() => setTab('proxy')}>{t('Preferences.Proxy')}</div>
            <div className={getTabClassname('keybindings')} role="tab" onClick={() => setTab('keybindings')}>{t('Preferences.Keybindings')}</div>
            <div className={getTabClassname('support')} role="tab" onClick={() => setTab('support')}>{t('Preferences.Support')}</div>
          </div>
          <section className="flex flex-grow px-2 pt-2 pb-6 tab-panel">{getTabPanel(tab)}</section>
        </div>
      </Modal>
    </StyledWrapper>
  );
};

export default Preferences;
