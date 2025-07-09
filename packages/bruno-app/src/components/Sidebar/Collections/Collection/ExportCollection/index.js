import React from 'react';
import exportBrunoCollection from 'utils/collections/export';
import exportPostmanCollection from 'utils/exporters/postman-collection';
import cloneDeep from 'lodash/cloneDeep';
import Modal from 'components/Modal';
import { transformCollectionToSaveToExportAsFile } from 'utils/collections/index';
import { useTranslation } from 'react-i18next';

const ExportCollection = ({ onClose, collection }) => {
  const { t } = useTranslation();
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
    <Modal size="sm" title="Export Collection" hideFooter={true} handleConfirm={onClose} handleCancel={onClose}>
      <div>
        <div className="text-link hover:underline cursor-pointer" onClick={handleExportBrunoCollection}>
          {t('Sidebar_Collections_Collection_ExportCollection.Bruno_Collection')}
        </div>
        <div className="text-link hover:underline cursor-pointer mt-2" onClick={handleExportPostmanCollection}>{t('Sidebar_Collections_Collection_ExportCollection.Postman_Collection')}</div>
      </div>
    </Modal>
  );
};

export default ExportCollection;
