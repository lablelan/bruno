import React, { useEffect, useState, useCallback } from 'react';
import { closeTabs } from 'providers/ReduxStore/slices/tabs';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const FolderNotFound = ({ folderUid }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const closeTab = useCallback(() => {
    dispatch(
      closeTabs({
        tabUids: [folderUid]
      })
    );
  }, [dispatch, folderUid]);

  useEffect(() => {
    setTimeout(() => {
      setShowErrorMessage(true);
    }, 300);
  }, []);

  if (!showErrorMessage) {
    return null;
  }

  return (
    <div className="mt-6 px-6">
      <div className="p-4 bg-orange-100 border-l-4 border-yellow-500 text-yellow-700">
        <div> {t('RequestTabPanel_FolderNotFound.LongDescriptions2')}</div>
        <div className="mt-2">
          {t('RequestTabPanel_FolderNotFound.LongDescriptions1')}
        </div>
      </div>
      <button className="btn btn-md btn-secondary mt-6" onClick={closeTab}>{t('RequestTabPanel_FolderNotFound.Close_Tab')}</button>
    </div>
  );
};

export default FolderNotFound; 