import React from 'react';
import { useTranslation } from 'react-i18next';

const NetworkError = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex bg-red-100">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800">{t('ResponsePane_NetworkError.Network_Error')}</p>
          </div>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={onClose}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium focus:outline-none"
        >{t('ResponsePane_NetworkError.Close')}</button>
      </div>
    </div>
  );
};

export default NetworkError;
