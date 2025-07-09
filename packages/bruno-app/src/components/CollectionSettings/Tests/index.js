import React from 'react';
import get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import CodeEditor from 'components/CodeEditor';
import { updateCollectionTests } from 'providers/ReduxStore/slices/collections';
import { saveCollectionRoot } from 'providers/ReduxStore/slices/collections/actions';
import { useTheme } from 'providers/Theme';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const Tests = ({ collection }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tests = get(collection, 'root.request.tests', '');

  const { displayedTheme } = useTheme();
  const preferences = useSelector((state) => state.app.preferences);

  const onEdit = (value) => {
    dispatch(
      updateCollectionTests({
        tests: value,
        collectionUid: collection.uid
      })
    );
  };

  const handleSave = () => dispatch(saveCollectionRoot(collection.uid));

  return (
    <StyledWrapper className="w-full flex flex-col h-full">
      <div className="text-xs mb-4 text-muted">{t('CollectionSettings_Tests.LongDescriptions')}</div>
      <CodeEditor
        collection={collection}
        value={tests || ''}
        theme={displayedTheme}
        onEdit={onEdit}
        mode="javascript"
        onSave={handleSave}
        font={get(preferences, 'font.codeFont', 'default')}
        fontSize={get(preferences, 'font.codeFontSize')}
        showHintsFor={['req', 'res', 'bru']}
      />

      <div className="mt-6">
        <button type="submit" className="submit btn btn-sm btn-secondary" onClick={handleSave}>{t('CollectionSettings_Tests.Save')}</button>
      </div>
    </StyledWrapper>
  );
};

export default Tests;
