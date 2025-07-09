import React from 'react';
import get from 'lodash/get';
import { useTheme } from 'providers/Theme';
import { useDispatch } from 'react-redux';
import SingleLineEditor from 'components/SingleLineEditor';
import { updateCollectionAuth } from 'providers/ReduxStore/slices/collections';
import { saveCollectionRoot } from 'providers/ReduxStore/slices/collections/actions';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';





const NTLMAuth = ({ collection }) => {
  const { t } = useTranslation();


  const dispatch = useDispatch();
  const { storedTheme } = useTheme();

  const ntlmAuth = get(collection, 'root.request.auth.ntlm', {});

  const handleSave = () => dispatch(saveCollectionRoot(collection.uid));


  const handleUsernameChange = (username) => {
    dispatch(
      updateCollectionAuth({
        mode: 'ntlm',
        collectionUid: collection.uid,
        content: {
          username: username || '',
          password: ntlmAuth.password || '',
          domain: ntlmAuth.domain || ''

        }
      })
    );
  };

  const handlePasswordChange = (password) => {
    dispatch(
      updateCollectionAuth({
        mode: 'ntlm',
        collectionUid: collection.uid,
        content: {
          username: ntlmAuth.username || '',
          password: password || '',
          domain: ntlmAuth.domain || ''
        }
      })
    );
  };

  const handleDomainChange = (domain) => {
    dispatch(
      updateCollectionAuth({
        mode: 'ntlm',
        collectionUid: collection.uid,
        content: {
          username: ntlmAuth.username || '',
          password: ntlmAuth.password || '',
          domain: domain || ''
        }
      })
    );
  };  




  return (
    <StyledWrapper className="mt-2 w-full">
      <label className="block font-medium mb-2">{t('CollectionSettings_Auth_NTLMAuth.Username')}</label>
      <div className="single-line-editor-wrapper mb-2">
        <SingleLineEditor
          value={ntlmAuth.username || ''}
          theme={storedTheme}
          onSave={handleSave}
          onChange={(val) => handleUsernameChange(val)}
          collection={collection}
        />
      </div>

      <label className="block font-medium mb-2">{t('CollectionSettings_Auth_NTLMAuth.Password')}</label>
      <div className="single-line-editor-wrapper">
        <SingleLineEditor
          value={ntlmAuth.password || ''}
          theme={storedTheme}
          onSave={handleSave}
          onChange={(val) => handlePasswordChange(val)}
          collection={collection}
          isSecret={true}
        />
      </div>

      <label className="block font-medium mb-2">{t('CollectionSettings_Auth_NTLMAuth.Domain')}</label>
      <div className="single-line-editor-wrapper">
        <SingleLineEditor
          value={ntlmAuth.domain || ''}
          theme={storedTheme}
          onSave={handleSave}
          onChange={(val) => handleDomainChange(val)}
          collection={collection}
        />
      </div>
    </StyledWrapper>
  );
};

export default NTLMAuth;
