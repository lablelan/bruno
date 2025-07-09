import React from 'react';
import get from 'lodash/get';
import { useTheme } from 'providers/Theme';
import { useDispatch } from 'react-redux';
import SingleLineEditor from 'components/SingleLineEditor';
import { updateCollectionAuth } from 'providers/ReduxStore/slices/collections';
import { saveCollectionRoot } from 'providers/ReduxStore/slices/collections/actions';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const WsseAuth = ({ collection }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { storedTheme } = useTheme();

  const wsseAuth = get(collection, 'root.request.auth.wsse', {});

  const handleSave = () => dispatch(saveCollectionRoot(collection.uid));

  const handleUserChange = (username) => {
    dispatch(
      updateCollectionAuth({
        mode: 'wsse',
        collectionUid: collection.uid,
        content: {
          username: username || '',
          password: wsseAuth.password || ''
        }
      })
    );
  };

  const handlePasswordChange = (password) => {
    dispatch(
      updateCollectionAuth({
        mode: 'wsse',
        collectionUid: collection.uid,
        content: {
          username: wsseAuth.username || '',
          password: password || ''
        }
      })
    );
  };

  return (
    <StyledWrapper className="mt-2 w-full">
      <label className="block font-medium mb-2">{t('CollectionSettings_Auth_WsseAuth.Username')}</label>
      <div className="single-line-editor-wrapper mb-2">
        <SingleLineEditor
          value={wsseAuth.username || ''}
          theme={storedTheme}
          onSave={handleSave}
          onChange={(val) => handleUserChange(val)}
          collection={collection}
        />
      </div>

      <label className="block font-medium mb-2">{t('CollectionSettings_Auth_WsseAuth.Password')}</label>
      <div className="single-line-editor-wrapper">
        <SingleLineEditor
          value={wsseAuth.password || ''}
          theme={storedTheme}
          onSave={handleSave}
          onChange={(val) => handlePasswordChange(val)}
          collection={collection}
        />
      </div>
    </StyledWrapper>
  );
};

export default WsseAuth;
