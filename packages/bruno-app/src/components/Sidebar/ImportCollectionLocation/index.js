import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { browseDirectory } from 'providers/ReduxStore/slices/collections/actions';
import Modal from 'components/Modal';
import Help from 'components/Help';
import { useTranslation } from 'react-i18next';


const ImportCollectionLocation = ({ onClose, handleSubmit, collectionName }) => {
  const { t } = useTranslation();
  const inputRef = useRef();
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      collectionLocation: ''
    },
    validationSchema: Yup.object({
      collectionLocation: Yup.string()
        .min(1, 'must be at least 1 character')
        .max(500, 'must be 500 characters or less')
        .required('Location is required')
    }),
    onSubmit: (values) => {
      handleSubmit(values.collectionLocation);
    }
  });
  const browse = () => {
    dispatch(browseDirectory())
      .then((dirPath) => {
        if (typeof dirPath === 'string' && dirPath.length > 0) {
          formik.setFieldValue('collectionLocation', dirPath);
        }
      })
      .catch((error) => {
        formik.setFieldValue('collectionLocation', '');
        console.error(error);
      });
  };

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onSubmit = () => formik.handleSubmit();

  return (
    <Modal size="sm" title="Import Collection" confirmText="Import" handleConfirm={onSubmit} handleCancel={onClose}>
      <form className="bruno-form" onSubmit={e => e.preventDefault()}>
        <div>
          <label htmlFor="collectionName" className="block font-semibold">{t('Sidebar_ImportCollectionLocation.Name')}</label>
          <div className="mt-2">{collectionName}</div>
          <>
            <label htmlFor="collectionLocation" className="block font-semibold mt-3 flex items-center">
              {t('Sidebar_ImportCollectionLocation.Location')}
              <Help>
                <p>
                  {t('Sidebar_ImportCollectionLocation.LongDescriptions1')}
                </p>
                <p className="mt-2">
                  {t('Sidebar_ImportCollectionLocation.LongDescriptions2')}
                  
                </p>
              </Help>
            </label>
            <input
              id="collection-location"
              type="text"
              name="collectionLocation"
              className="block textbox mt-2 w-full cursor-pointer"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={formik.values.collectionLocation || ''}
              onClick={browse}
              onChange={e => {
                formik.setFieldValue('collectionLocation', e.target.value);
              }}
            />
          </>
          {formik.touched.collectionLocation && formik.errors.collectionLocation ? (
            <div className="text-red-500">{formik.errors.collectionLocation}</div>
          ) : null}

          <div className="mt-1">
            <span className="text-link cursor-pointer hover:underline" onClick={browse}>{t('Sidebar_ImportCollectionLocation.Browse')}</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ImportCollectionLocation;
