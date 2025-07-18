import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import StyledWrapper from './StyledWrapper';
import toast from 'react-hot-toast';
import { updateBrunoConfig } from 'providers/ReduxStore/slices/collections/actions';
import cloneDeep from 'lodash/cloneDeep';
import { useTranslation } from 'react-i18next';

const PresetsSettings = ({ collection }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    brunoConfig: { presets: presets = {} }
  } = collection;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      requestType: presets.requestType || 'http',
      requestUrl: presets.requestUrl || ''
    },
    onSubmit: (newPresets) => {
      const brunoConfig = cloneDeep(collection.brunoConfig);
      brunoConfig.presets = newPresets;
      dispatch(updateBrunoConfig(brunoConfig, collection.uid));
      toast.success('Collection presets updated');
    }
  });

  return (
    <StyledWrapper className="h-full w-full">
      <div className="text-xs mb-4 text-muted">
        {t('CollectionSettings_Presets.LongDescriptions')}
      </div>
      <form className="bruno-form" onSubmit={formik.handleSubmit}>
        <div className="mb-3 flex items-center">
          <label className="settings-label flex  items-center" htmlFor="enabled">{t('CollectionSettings_Presets.Request_Type')}</label>
          <div className="flex items-center">
            <input
              id="http"
              className="cursor-pointer"
              type="radio"
              name="requestType"
              onChange={formik.handleChange}
              value="http"
              checked={formik.values.requestType === 'http'}
            />
            <label htmlFor="http" className="ml-1 cursor-pointer select-none">{t('CollectionSettings_Presets.HTTP')}</label>

            <input
              id="graphql"
              className="ml-4 cursor-pointer"
              type="radio"
              name="requestType"
              onChange={formik.handleChange}
              value="graphql"
              checked={formik.values.requestType === 'graphql'}
            />
            <label htmlFor="graphql" className="ml-1 cursor-pointer select-none">{t('CollectionSettings_Presets.GraphQL')}</label>
          </div>
        </div>
        <div className="mb-3 flex items-center">
          <label className="settings-label" htmlFor="requestUrl">{t('CollectionSettings_Presets.Base_URL')}</label>
          <div className="flex items-center w-full">
            <div className="flex items-center flex-grow input-container h-full">
              <input
                id="request-url"
                type="text"
                name="requestUrl"
                placeholder='Request URL'
                className="block textbox"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={formik.handleChange}
                value={formik.values.requestUrl || ''}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" className="submit btn btn-sm btn-secondary">{t('CollectionSettings_Presets.Save')}</button>
        </div>
      </form>
    </StyledWrapper>
  );
};

export default PresetsSettings;
