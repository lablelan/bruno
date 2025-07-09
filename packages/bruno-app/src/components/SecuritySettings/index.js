import { useState } from 'react';
import { saveCollectionSecurityConfig } from 'providers/ReduxStore/slices/collections/actions';
import toast from 'react-hot-toast';
import StyledWrapper from './StyledWrapper';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const SecuritySettings = ({ collection }) => {
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
    <StyledWrapper className="flex flex-col h-full relative px-4 py-4">
      <div className='font-semibold mt-2'>{t('SecuritySettings.JavaScript_Sandbox')}</div>

      <div className='mt-4'>
      {t('SecuritySettings.LongDescriptions1')}
      </div>

      <div className="flex flex-col mt-4">
        <div className="flex flex-col">
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
            <span className={jsSandboxMode === 'safe' ? 'font-medium' : 'font-normal'}>{t('SecuritySettings.Safe_Mode')}</span>
          </label>
          <p className='text-sm text-muted mt-1'>
            {t('SecuritySettings.LongDescriptions2')}
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
              {t('SecuritySettings.Developer_Mode')}
              <span className='ml-1 developer-mode-warning'>({t('SecuritySettings.LongDescriptions3')})</span>
            </span>
          </label>
          <p className='text-sm text-muted mt-1'>
            {t('SecuritySettings.LongDescriptions4')}
          </p>
        </div>
        <button onClick={handleSave} className="submit btn btn-sm btn-secondary w-fit mt-6">{t('SecuritySettings.Save')}</button>
      </div>
    </StyledWrapper>
  );
};

export default SecuritySettings;
