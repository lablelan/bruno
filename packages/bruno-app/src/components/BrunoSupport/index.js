import React from 'react';
import Modal from 'components/Modal/index';
import { IconSpeakerphone, IconBrandTwitter, IconBrandGithub, IconBrandDiscord, IconBook } from '@tabler/icons';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const BrunoSupport = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <StyledWrapper>
      <Modal size="sm" title={'Support'} handleCancel={onClose} hideFooter={true}>
        <div className="collection-options">
          <div className="mt-2">
            <a href="https://docs.usebruno.com" target="_blank" className="flex items-end">
              <IconBook size={18} strokeWidth={2} />
              <span className="label ml-2">{t('BrunoSupport.Documentation')}</span>
            </a>
          </div>
          <div className="mt-2">
            <a href="https://github.com/usebruno/bruno/issues" target="_blank" className="flex items-end">
              <IconSpeakerphone size={18} strokeWidth={2} />
              <span className="label ml-2">{t('BrunoSupport.Report_Issues')}</span>
            </a>
          </div>
          <div className="mt-2">
            <a href="https://discord.com/invite/KgcZUncpjq" target="_blank" className="flex items-end">
              <IconBrandDiscord size={18} strokeWidth={2} />
              <span className="label ml-2">{t('BrunoSupport.Discord')}</span>
            </a>
          </div>
          <div className="mt-2">
            <a href="https://github.com/usebruno/bruno" target="_blank" className="flex items-end">
              <IconBrandGithub size={18} strokeWidth={2} />
              <span className="label ml-2">{t('BrunoSupport.GitHub')}</span>
            </a>
          </div>
          <div className="mt-2">
            <a href="https://twitter.com/use_bruno" target="_blank" className="flex items-end">
              <IconBrandTwitter size={18} strokeWidth={2} />
              <span className="label ml-2">{t('BrunoSupport.Twitter')}</span>
            </a>
          </div>
        </div>
      </Modal>
    </StyledWrapper>
  );
};

export default BrunoSupport;
