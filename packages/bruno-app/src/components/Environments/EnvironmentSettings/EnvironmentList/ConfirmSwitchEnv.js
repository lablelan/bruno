import React from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import Modal from 'components/Modal';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const ConfirmSwitchEnv = ({ onCancel }) => {
  const { t } = useTranslation();
  return createPortal(
    <Modal
      size="md"
      title="Unsaved changes"
      confirmText="Save and Close"
      cancelText="Close without saving"
      disableEscapeKey={true}
      disableCloseOnOutsideClick={true}
      closeModalFadeTimeout={150}
      handleCancel={onCancel}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      hideFooter={true}
    >
      <div className="flex items-center font-normal">
        <IconAlertTriangle size={32} strokeWidth={1.5} className="text-yellow-600" />
        <h1 className="ml-2 text-lg font-semibold">Hold on..</h1>
      </div>
      <div className="font-normal mt-4">{t('Environments_EnvironmentSettings_EnvironmentList.LongDescriptions1')}</div>

      <div className="flex justify-between mt-6">
        <div>
          <button className="btn btn-sm btn-danger" onClick={onCancel}>{t('Environments_EnvironmentSettings_EnvironmentList.Close')}</button>
        </div>
        <div></div>
      </div>
    </Modal>,
    document.body
  );
};

export default ConfirmSwitchEnv;
