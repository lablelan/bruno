import { useDispatch } from 'react-redux';
import { IconShieldLock } from '@tabler/icons';
import { addTab } from 'providers/ReduxStore/slices/tabs';
import { uuid } from 'utils/common/index';
import JsSandboxModeModal from '../JsSandboxModeModal';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const JsSandboxMode = ({ collection }) => {
  const { t } = useTranslation();
  const jsSandboxMode = collection?.securityConfig?.jsSandboxMode;
  const dispatch = useDispatch();

  const viewSecuritySettings = () => {
    dispatch(
      addTab({
        uid: uuid(),
        collectionUid: collection.uid,
        type: 'security-settings'
      })
    );
  };

  return (
    <StyledWrapper className='flex'>
      {jsSandboxMode === 'safe' && (
        <div
          className="flex items-center border rounded-md text-xs cursor-pointer safe-mode"
          onClick={viewSecuritySettings}
        >{t('SecuritySettings_JsSandboxMode.Safe_Mode')}</div>
      )}
      {jsSandboxMode === 'developer' && (
        <div
          className="flex items-center border rounded-md text-xs cursor-pointer developer-mode"
          onClick={viewSecuritySettings}
        >{t('SecuritySettings_JsSandboxMode.Developer_Mode')}</div>
      )}
      {!jsSandboxMode ? <JsSandboxModeModal collection={collection} /> : null}
    </StyledWrapper>
  );
};

export default JsSandboxMode;
