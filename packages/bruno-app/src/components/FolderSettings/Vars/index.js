import React from 'react';
import get from 'lodash/get';
import VarsTable from './VarsTable';
import StyledWrapper from './StyledWrapper';
import { saveFolderRoot } from 'providers/ReduxStore/slices/collections/actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Vars = ({ collection, folder }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const requestVars = get(folder, 'root.request.vars.req', []);
  const responseVars = get(folder, 'root.request.vars.res', []);
  const handleSave = () => dispatch(saveFolderRoot(collection.uid, folder.uid));
  return (
    <StyledWrapper className="w-full flex flex-col">
      <div className="flex-1 mt-2">
        <div className="mb-1 title text-xs">{t('FolderSettings_Vars.Pre_Request')}</div>
        <VarsTable folder={folder} collection={collection} vars={requestVars} varType="request" />
      </div>
      <div className="flex-1">
        <div className="mt-1 mb-1 title text-xs">{t('FolderSettings_Vars.Post_Response')}</div>
        <VarsTable folder={folder} collection={collection} vars={responseVars} varType="response" />
      </div>
      <div className="mt-6">
        <button type="submit" className="submit btn btn-sm btn-secondary" onClick={handleSave}>{t('FolderSettings_Vars.Save')}</button>
      </div>
    </StyledWrapper>
  );
};

export default Vars;
