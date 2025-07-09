import React from 'react';
import get from 'lodash/get';
import { useTheme } from 'providers/Theme';
import { useDispatch } from 'react-redux';
import SingleLineEditor from 'components/SingleLineEditor';
import { updateCollectionAuth } from 'providers/ReduxStore/slices/collections';
import { saveCollectionRoot } from 'providers/ReduxStore/slices/collections/actions';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const BearerAuth = ({ collection }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { storedTheme } = useTheme();

  const bearerToken = get(collection, 'root.request.auth.bearer.token', '');

  const handleSave = () => dispatch(saveCollectionRoot(collection.uid));

  const handleTokenChange = (token) => {
    dispatch(
      updateCollectionAuth({
        mode: 'bearer',
        collectionUid: collection.uid,
        content: {
          token: token
        }
      })
    );
  };

  return (
    <StyledWrapper className="mt-2 w-full">
      <label className="block font-medium mb-2">{t('CollectionSettings_Auth_BearerAuth.Token')}</label>
      <div className="single-line-editor-wrapper">
        <SingleLineEditor
          value={bearerToken}
          theme={storedTheme}
          onSave={handleSave}
          onChange={(val) => handleTokenChange(val)}
          collection={collection}
          isSecret={true}
        />
      </div>
    </StyledWrapper>
  );
};

export default BearerAuth;
