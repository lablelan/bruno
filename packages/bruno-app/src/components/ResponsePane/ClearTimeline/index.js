import React from 'react';
import { useDispatch } from 'react-redux';
import StyledWrapper from './StyledWrapper';
import { clearRequestTimeline } from 'providers/ReduxStore/slices/collections/index';
import { useTranslation } from 'react-i18next';

const ClearTimeline = ({ collection, item }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const clearResponse = () =>
    dispatch(
      clearRequestTimeline({
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );

  return (
    <StyledWrapper className="ml-2 flex items-center">
      <button onClick={clearResponse} className='text-link hover:underline' title="Clear Timeline">{t('ResponsePane_ClearTimeline.Clear_Timeline')}</button>
    </StyledWrapper>
  );
};

export default ClearTimeline;
