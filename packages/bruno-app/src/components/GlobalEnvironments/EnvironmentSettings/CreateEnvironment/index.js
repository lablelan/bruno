import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Portal from 'components/Portal';
import Modal from 'components/Modal';
import { addGlobalEnvironment } from 'providers/ReduxStore/slices/global-environments';
import { validateName, validateNameError } from 'utils/common/regex';
import { useTranslation } from 'react-i18next';

const CreateEnvironment = ({ onClose }) => {
  const { t } = useTranslation();
  const globalEnvs = useSelector((state) => state?.globalEnvironments?.globalEnvironments);

  const validateEnvironmentName = (name) => {
    const trimmedName = name?.toLowerCase().trim();
    return globalEnvs.every((env) => env?.name?.toLowerCase().trim() !== trimmedName);
  };

  const dispatch = useDispatch();
  const inputRef = useRef();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, 'Must be at least 1 character')
        .max(255, 'Must be 255 characters or less')
        .test('is-valid-filename', function(value) {
          const isValid = validateName(value);
          return isValid ? true : this.createError({ message: validateNameError(value) });
        })
        .required('Name is required')
        .test('duplicate-name', 'Global Environment already exists', validateEnvironmentName)
    }),
    onSubmit: (values) => {
      dispatch(addGlobalEnvironment({ name: values.name }))
        .then(() => {
          toast.success('Global environment created!');
          onClose();
        })
        .catch(() => toast.error('An error occurred while creating the environment'));
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
        title={'Create Global Environment'}
        confirmText="Create"
        handleConfirm={onSubmit}
        handleCancel={onClose}
      >
        <form className="bruno-form" onSubmit={e => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block font-semibold">{t('GlobalEnvironments_EnvironmentSettings_CreateEnvironment.Environment_Name')}</label>
            <div className="flex items-center mt-2">
              <input
                id="environment-name"
                type="text"
                name="name"
                ref={inputRef}
                className="block textbox w-full"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={formik.handleChange}
                value={formik.values.name || ''}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500">{formik.errors.name}</div>
            ) : null}
          </div>
        </form>
      </Modal>
    </Portal>
  );
};

export default CreateEnvironment;
