import Modal from 'components/Modal/index';
import React, { useState } from 'react';
import CreateEnvironment from './CreateEnvironment';
import EnvironmentList from './EnvironmentList';
import StyledWrapper from './StyledWrapper';
import { IconFileAlert } from '@tabler/icons';
import ImportEnvironment from './ImportEnvironment/index';
import { useTranslation } from 'react-i18next';

export const SharedButton = ({ children, className, onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded bg-transparent px-2.5 py-2 w-fit text-xs font-semibold text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-700
        ${className}`}
    >
      {children}
    </button>
  );
};

const DefaultTab = ({ setTab }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center items-center flex flex-col">
      <IconFileAlert size={64} strokeWidth={1} />
      <span className="font-semibold mt-2">{t('GlobalEnvironments_EnvironmentSettings.No_Global_Environments_found')}</span>
      <div className="flex items-center justify-center mt-6">
        <SharedButton onClick={() => setTab('create')}>
          <span>{t('GlobalEnvironments_EnvironmentSettings.Create_Global_Environment')}</span>
        </SharedButton>

        <span className="mx-4">{t('GlobalEnvironments_EnvironmentSettings.Or')}</span>

        <SharedButton onClick={() => setTab('import')}>
          <span>{t('GlobalEnvironments_EnvironmentSettings.Import_Environment')}</span>
        </SharedButton>
      </div>
    </div>
  );
};

const EnvironmentSettings = ({ globalEnvironments, activeGlobalEnvironmentUid, onClose }) => {
  const { t } = useTranslation();
  const [isModified, setIsModified] = useState(false);
  const environments = globalEnvironments;
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [tab, setTab] = useState('default');
  if (!environments || !environments.length) {
    return (
      <StyledWrapper>
        <Modal size="md" title={t('GlobalEnvironments_EnvironmentSettings.Global_Environments')} handleCancel={onClose} hideCancel={true} hideFooter={true}>
          {tab === 'create' ? (
            <CreateEnvironment onClose={() => setTab('default')} />
          ) : tab === 'import' ? (
            <ImportEnvironment onClose={() => setTab('default')} />
          ) : (
            <></>
          )}
          <DefaultTab setTab={setTab} />
        </Modal>
      </StyledWrapper>
    );
  }

  return (
    <Modal size="lg" title={t('GlobalEnvironments_EnvironmentSettings.Global_Environments')} handleCancel={onClose} hideFooter={true}>
      <EnvironmentList
        environments={globalEnvironments}
        activeEnvironmentUid={activeGlobalEnvironmentUid}
        selectedEnvironment={selectedEnvironment}
        setSelectedEnvironment={setSelectedEnvironment}
        isModified={isModified}
        setIsModified={setIsModified}
      />
    </Modal>
  );
};

export default EnvironmentSettings;
