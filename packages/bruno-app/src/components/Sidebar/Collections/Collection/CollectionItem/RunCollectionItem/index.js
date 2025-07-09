import React from 'react';
import get from 'lodash/get';
import { uuid } from 'utils/common';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { addTab } from 'providers/ReduxStore/slices/tabs';
import { runCollectionFolder } from 'providers/ReduxStore/slices/collections/actions';
import { flattenItems } from 'utils/collections';
import StyledWrapper from './StyledWrapper';
import { areItemsLoading } from 'utils/collections';
import { useTranslation } from 'react-i18next';

const RunCollectionItem = ({ collectionUid, item, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const collection = useSelector(state => state.collections.collections?.find(c => c.uid === collectionUid));
  const isCollectionRunInProgress = collection?.runnerResult?.info?.status && (collection?.runnerResult?.info?.status !== 'ended');

  const onSubmit = (recursive) => {
    dispatch(
      addTab({
        uid: uuid(),
        collectionUid: collection.uid,
        type: 'collection-runner'
      })
    );
    if (!isCollectionRunInProgress) {
      dispatch(runCollectionFolder(collection.uid, item ? item.uid : null, recursive));
    }
    onClose();
  };

  const handleViewRunner = (e) => {
    e.preventDefault();
    dispatch(
      addTab({
        uid: uuid(),
        collectionUid: collection.uid,
        type: 'collection-runner'
      })
    );
    onClose();
  }

  const getRequestsCount = (items) => {
    const requestTypes = ['http-request', 'graphql-request']
    return items.filter(req => requestTypes.includes(req.type)).length;
  }

  const runLength = item ? getRequestsCount(item.items) : get(collection, 'items.length', 0);
  const flattenedItems = flattenItems(item ? item.items : collection.items);
  const recursiveRunLength = getRequestsCount(flattenedItems);

  const isFolderLoading = areItemsLoading(item);

  return (
    <StyledWrapper>
      <Modal size="md" title="Collection Runner" hideFooter={true} handleCancel={onClose}>
        {!runLength && !recursiveRunLength ? (
          <div className="mb-8">{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.LongDescriptions1')}</div>
        ) : (
          <div>
            <div className="mb-1">
              <span className="font-medium">{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.Run')}</span>
              <span className="ml-1 text-xs">({runLength} requests)</span>
            </div>
            <div className="mb-8">{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.LongDescriptions2')}</div>
            <div className="mb-1">
              <span className="font-medium">{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.Recursive_Run')}</span>
              <span className="ml-1 text-xs">({recursiveRunLength} requests)</span>
            </div>
            <div className={isFolderLoading ? "mb-2" : "mb-8"}>{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.LongDescriptions3')}</div>
            {isFolderLoading ? <div className='mb-8 warning'>{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.LongDescriptions4')}</div> : null}
            {isCollectionRunInProgress ? <div className='mb-6 warning'>{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.LongDescriptions5')}</div> : null}
            <div className="flex justify-end bruno-modal-footer">
              <span className="mr-3">
                <button type="button" onClick={onClose} className="btn btn-md btn-close">{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.Cancel')}</button>
              </span>
              {
                isCollectionRunInProgress ? 
                  <span>
                    <button type="submit" className="submit btn btn-md btn-secondary mr-3" onClick={handleViewRunner}>{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.View_Run')}</button>
                  </span>
                :
                  <>
                    <span>
                      <button type="submit" disabled={!recursiveRunLength} className="submit btn btn-md btn-secondary mr-3" onClick={() => onSubmit(true)}>{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.Recursive_Run')}</button>
                    </span>
                    <span>
                      <button type="submit" disabled={!runLength} className="submit btn btn-md btn-secondary" onClick={() => onSubmit(false)}>{t('Sidebar_Collections_Collection_CollectionItem_RunCollectionItem.Run')}</button>
                    </span>
                  </>
              }
            </div>
          </div>
        )}
      </Modal>
    </StyledWrapper>
  );
};

export default RunCollectionItem;
