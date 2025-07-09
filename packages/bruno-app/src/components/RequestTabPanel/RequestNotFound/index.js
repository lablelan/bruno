import React, { useEffect, useState } from 'react';
import { closeTabs } from 'providers/ReduxStore/slices/tabs';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const RequestNotFound = ({ itemUid }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const closeTab = () => {
    dispatch(
      closeTabs({
        tabUids: [itemUid]
      })
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setShowErrorMessage(true);
    }, 300);
  }, []);

  // add a delay component in react that shows a loading spinner
  // and then shows the error message after a delay
  // this will prevent the error message from flashing on the screen

  if (!showErrorMessage) {
    return null;
  }

  return (
    <div className="mt-6 px-6">
      <div className="p-4 bg-orange-100 border-l-4 border-yellow-500 text-yellow-700">
        <div>{t('RequestTabPanel_RequestNotFound.LongDescriptions2')}</div>
        <div className="mt-2">
          {t('RequestTabPanel_RequestNotFound.LongDescriptions1')}
        </div>
      </div>
      <button className="btn btn-md btn-secondary mt-6" onClick={closeTab}>{t('RequestTabPanel_RequestNotFound.Close_Tab')}</button>
    </div>
  );
};

export default RequestNotFound;
