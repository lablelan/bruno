import { saveCollectionSecurityConfig } from 'providers/ReduxStore/slices/collections/actions';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Portal from 'components/Portal';
import Modal from 'components/Modal';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const JsSandboxModeModal = ({ collection }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [jsSandboxMode, setJsSandboxMode] = useState(collection?.securityConfig?.jsSandboxMode || 'safe');

  const handleChange = (e) => {
    setJsSandboxMode(e.target.value);
  };

  const handleSave = () => {
    dispatch(
      saveCollectionSecurityConfig(collection?.uid, {
        jsSandboxMode: jsSandboxMode
      })
    )
      .then(() => {
        toast.success('Sandbox mode updated successfully');
      })
      .catch((err) => console.log(err) && toast.error('Failed to update sandbox mode'));
  };

  return (
    <Portal>
      <Modal
        size="sm"
        title={'JavaScript Sandbox'}
        confirmText="Save"
        handleConfirm={handleSave}
        hideCancel={true}
        hideClose={true}
        disableCloseOnOutsideClick={true}
        disableEscapeKey={true}
      >
        <StyledWrapper>
          <div>
            {t('SecuritySettings_JsSandboxModeModal.LongDescriptions5')}
            
          </div>

          <div className='text-muted mt-6'>
            {t('SecuritySettings_JsSandboxModeModal.LongDescriptions4')}
            
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="safe" className="flex flex-row items-center gap-2 cursor-pointer">
              <input
                type="radio"
                id="safe"
                name="jsSandboxMode"
                value="safe"
                checked={jsSandboxMode === 'safe'}
                onChange={handleChange}
                className="cursor-pointer"
              />
              <span className={jsSandboxMode === 'safe' ? 'font-medium' : 'font-normal'}>{t('SecuritySettings_JsSandboxModeModal.Safe_Mode')}</span>
            </label>
            <p className='text-sm text-muted mt-1'>
              {t('SecuritySettings_JsSandboxModeModal.LongDescriptions3')}
              
            </p>

            <label htmlFor="developer" className="flex flex-row gap-2 mt-6 cursor-pointer">
              <input
                type="radio"
                id="developer"
                name="jsSandboxMode"
                value="developer"
                checked={jsSandboxMode === 'developer'}
                onChange={handleChange}
                className="cursor-pointer"
              />
              <span className={jsSandboxMode === 'developer' ? 'font-medium' : 'font-normal'}>
                {t('SecuritySettings_JsSandboxModeModal.Developer_Mode')}
                <span className='ml-1 developer-mode-warning'>({t('SecuritySettings_JsSandboxModeModal.LongDescriptions2')})</span>
              </span>
            </label>
            <p className='text-sm text-muted mt-1'>
              {t('SecuritySettings_JsSandboxModeModal.LongDescriptions1')}
              
            </p>
          </div>
        </StyledWrapper>
      </Modal>
    </Portal>
  );
};

export default JsSandboxModeModal;
