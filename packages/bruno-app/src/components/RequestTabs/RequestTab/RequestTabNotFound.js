import React, { useState, useEffect } from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import CloseTabIcon from './CloseTabIcon';
import { useTranslation } from 'react-i18next';

const RequestTabNotFound = ({ handleCloseClick }) => {
  const { t } = useTranslation();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // add a delay component in react that shows a loading spinner
  // and then shows the error message after a delay
  // this will prevent the error message from flashing on the screen
  useEffect(() => {
    setTimeout(() => {
      setShowErrorMessage(true);
    }, 300);
  }, []);

  if (!showErrorMessage) {
    return null;
  }

  return (
    <>
      <div className="flex items-center tab-label pl-2">
        {showErrorMessage ? (
          <>
            <IconAlertTriangle size={18} strokeWidth={1.5} className="text-yellow-600" />
            <span className="ml-1">{t('RequestTabs_RequestTab.Not_Found')}</span>
          </>
        ) : null}
      </div>
      <div className="flex px-2 close-icon-container" onClick={(e) => handleCloseClick(e)}>
        <CloseTabIcon />
      </div>
    </>
  );
};

export default RequestTabNotFound;
