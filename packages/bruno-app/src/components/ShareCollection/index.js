import React from 'react';
import Modal from 'components/Modal';
import { IconDownload } from '@tabler/icons';
import StyledWrapper from './StyledWrapper';
import Bruno from 'components/Bruno';
import exportBrunoCollection from 'utils/collections/export';
import exportPostmanCollection from 'utils/exporters/postman-collection';
import { cloneDeep } from 'lodash';
import { transformCollectionToSaveToExportAsFile } from 'utils/collections/index';
import { useSelector } from 'react-redux';
import { findCollectionByUid } from 'utils/collections/index';
import { useTranslation } from 'react-i18next';

const ShareCollection = ({ onClose, collectionUid }) => {
  const { t } = useTranslation();
  const collection = useSelector(state => findCollectionByUid(state.collections.collections, collectionUid));
  const handleExportBrunoCollection = () => {
    const collectionCopy = cloneDeep(collection);
    exportBrunoCollection(transformCollectionToSaveToExportAsFile(collectionCopy));
    onClose();
  };

  const handleExportPostmanCollection = () => {
    const collectionCopy = cloneDeep(collection);
    exportPostmanCollection(collectionCopy);
    onClose();
  };

  return (
    <Modal
      size="md"
      title="Share Collection"
      confirmText="Close"
      handleConfirm={onClose}
      handleCancel={onClose}
      hideCancel
    >
      <StyledWrapper className="flex flex-col h-full w-[500px]">
          <div className="space-y-2"> 
            <div className="flex border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500/10 items-center p-3 rounded-lg transition-colors cursor-pointer" onClick={handleExportBrunoCollection}>
              <div className="mr-3 p-1 rounded-full">
                <Bruno width={28} />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t('ShareCollection.Bruno_Collection')}</div>
                <div className="text-xs">{t('ShareCollection.Export_in_Bruno_format')}</div>
              </div>
            </div>
            
            <div className="flex border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500/10 items-center p-3 rounded-lg transition-colors cursor-pointer" onClick={handleExportPostmanCollection}>
              <div className="mr-3 p-1 rounded-full">
                <IconDownload size={28} strokeWidth={1} className="" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t('ShareCollection.Postman_Collection')}</div>
                <div className="text-xs">{t('ShareCollection.Export_in_Postman_format')}</div>
              </div>
            </div>
          </div>
      </StyledWrapper>
    </Modal>
  );
};

export default ShareCollection;
