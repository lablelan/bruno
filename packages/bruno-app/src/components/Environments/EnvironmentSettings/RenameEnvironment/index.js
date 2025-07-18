import React, { useEffect, useRef } from 'react';
import Portal from 'components/Portal/index';
import Modal from 'components/Modal/index';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { renameEnvironment } from 'providers/ReduxStore/slices/collections/actions';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { validateName, validateNameError } from 'utils/common/regex';
import { useTranslation } from 'react-i18next';

const RenameEnvironment = ({ onClose, environment, collection }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: environment.name
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, 'must be at least 1 character')
        .max(255, 'Must be 255 characters or less')
        .test('is-valid-filename', function(value) {
          const isValid = validateName(value);
          return isValid ? true : this.createError({ message: validateNameError(value) });
        })
        .required('name is required')
    }),
    onSubmit: (values) => {
      if (values.name === environment.name) {
        return;
      }
      dispatch(renameEnvironment(values.name, environment.uid, collection.uid))
        .then(() => {
          toast.success('Environment renamed successfully');
          onClose();
        })
        .catch(() => toast.error('An error occurred while renaming the environment'));
    }
  });

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <Portal>
      <Modal
        size="sm"
        title={'Rename Environment'}
        confirmText="Rename"
        handleConfirm={onSubmit}
        handleCancel={onClose}
      >
        <form className="bruno-form" onSubmit={e => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block font-semibold">{t('Environments_EnvironmentSettings_RenameEnvironment.Environment_Name')}</label>
            <input
              id="environment-name"
              type="text"
              name="name"
              ref={inputRef}
              className="block textbox mt-2 w-full"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={formik.handleChange}
              value={formik.values.name || ''}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500">{formik.errors.name}</div>
            ) : null}
          </div>
        </form>
      </Modal>
    </Portal>
  );
};

export default RenameEnvironment;
