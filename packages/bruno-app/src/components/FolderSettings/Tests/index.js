import React from 'react';
import get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import CodeEditor from 'components/CodeEditor';
import { updateFolderTests } from 'providers/ReduxStore/slices/collections';
import { saveFolderRoot } from 'providers/ReduxStore/slices/collections/actions';
import { useTheme } from 'providers/Theme';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const Tests = ({ collection, folder }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tests = get(folder, 'root.request.tests', '');

  const { displayedTheme } = useTheme();
  const preferences = useSelector((state) => state.app.preferences);

  const onEdit = (value) => {
    dispatch(
      updateFolderTests({
        tests: value,
        collectionUid: collection.uid,
        folderUid: folder.uid
      })
    );
  };

  const handleSave = () => dispatch(saveFolderRoot(collection.uid, folder.uid));

  return (
    <StyledWrapper className="w-full flex flex-col h-full">
      <div className="text-xs mb-4 text-muted">{t('FolderSettings_Tests.LongDescriptions1')}</div>
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
        <button type="submit" className="submit btn btn-sm btn-secondary" onClick={handleSave}>{t('FolderSettings_Tests.Save')}</button>
      </div>
    </StyledWrapper>
  );
};

export default Tests;
