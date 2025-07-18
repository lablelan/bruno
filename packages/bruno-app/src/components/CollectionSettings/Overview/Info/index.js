import React from "react";
import { getTotalRequestCountInCollection } from 'utils/collections/';
import { IconFolder, IconWorld, IconApi, IconShare } from '@tabler/icons';
import { areItemsLoading, getItemsLoadStats } from "utils/collections/index";
import { useState } from "react";
import ShareCollection from "components/ShareCollection/index";
import { useTranslation } from 'react-i18next';

const Info = ({ collection }) => {
  const { t } = useTranslation();
  const totalRequestsInCollection = getTotalRequestCountInCollection(collection);

  const isCollectionLoading = areItemsLoading(collection);
  const { loading: itemsLoadingCount, total: totalItems } = getItemsLoadStats(collection);
  const [showShareCollectionModal, toggleShowShareCollectionModal] = useState(false);
  
  const handleToggleShowShareCollectionModal = (value) => (e) => {
    toggleShowShareCollectionModal(value);
  }

  return (
    <div className="w-full flex flex-col h-fit">
      <div className="rounded-lg py-6">
        <div className="grid gap-6">
          {/* Location Row */}
          <div className="flex items-start">
            <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <IconFolder className="w-5 h-5 text-blue-500" stroke={1.5} />
            </div>
            <div className="ml-4">
              <div className="font-semibold text-sm">{t('CollectionSettings_Overview_Info.Location')}</div>
              <div className="mt-1 text-sm text-muted break-all">
                {collection.pathname}
              </div>
            </div>
          </div>

          {/* Environments Row */}
          <div className="flex items-start">
            <div className="flex-shrink-0 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <IconWorld className="w-5 h-5 text-green-500" stroke={1.5} />
            </div>
            <div className="ml-4">
              <div className="font-semibold text-sm">{t('CollectionSettings_Overview_Info.Environments')}</div>
              <div className="mt-1 text-sm text-muted">
                {collection.environments?.length || 0} {collection.environments?.length !== 1 ? t('CollectionSettings_Overview_Info.environment')+'s' : t('CollectionSettings_Overview_Info.environment')} {t('CollectionSettings_Overview_Info.configured')}
              </div>
            </div>
          </div>

          {/* Requests Row */}
          <div className="flex items-start">
            <div className="flex-shrink-0 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <IconApi className="w-5 h-5 text-purple-500" stroke={1.5} />
            </div>
            <div className="ml-4">
              <div className="font-semibold text-sm">{t('CollectionSettings_Overview_Info.Requests')}</div>
              <div className="mt-1 text-sm text-muted">
                {
                  isCollectionLoading? `${totalItems - itemsLoadingCount} ${t('CollectionSettings_Overview_Info.out_of')} ${totalItems} ${t('CollectionSettings_Overview_Info.requests_in_the_collection_loaded')}` : `${totalRequestsInCollection} ${totalRequestsInCollection !== 1 ? t('CollectionSettings_Overview_Info.request') + 's' : t('CollectionSettings_Overview_Info.request')} ${t('CollectionSettings_Overview_Info.in_collection')}`
                }
              </div>
            </div>
          </div>

          <div className="flex items-start group cursor-pointer" onClick={handleToggleShowShareCollectionModal(true)}>
            <div className="flex-shrink-0 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <IconShare className="w-5 h-5 text-indigo-500" stroke={1.5} />
            </div>
            <div className="ml-4 h-full flex flex-col justify-start">
              <div className="font-semibold text-sm h-fit my-auto">{t('CollectionSettings_Overview_Info.Share')}</div>
              <div className="mt-1 text-sm group-hover:underline text-link">{t('CollectionSettings_Overview_Info.Share_Collection')}</div>
            </div>
          </div>
          {showShareCollectionModal && <ShareCollection collectionUid={collection.uid} onClose={handleToggleShowShareCollectionModal(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Info;