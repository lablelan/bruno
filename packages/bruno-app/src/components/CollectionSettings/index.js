import React from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import toast from 'react-hot-toast';
import { updateBrunoConfig } from 'providers/ReduxStore/slices/collections/actions';
import { updateSettingsSelectedTab } from 'providers/ReduxStore/slices/collections';
import { useDispatch } from 'react-redux';
import ProxySettings from './ProxySettings';
import ClientCertSettings from './ClientCertSettings';
import Headers from './Headers';
import Auth from './Auth';
import Script from './Script';
import Test from './Tests';
import Presets from './Presets';
import StyledWrapper from './StyledWrapper';
import Vars from './Vars/index';
import StatusDot from 'components/StatusDot';
import Overview from './Overview/index';
import { useTranslation } from 'react-i18next';

const CollectionSettings = ({ collection }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tab = collection.settingsSelectedTab;
  const setTab = (tab) => {
    dispatch(
      updateSettingsSelectedTab({
        collectionUid: collection.uid,
        tab
      })
    );
  };

  const root = collection?.root;
  const hasScripts = root?.request?.script?.res || root?.request?.script?.req;
  const hasTests = root?.request?.tests;
  const hasDocs = root?.docs;

  const headers = get(collection, 'root.request.headers', []);
  const activeHeadersCount = headers.filter((header) => header.enabled).length;

  const requestVars = get(collection, 'root.request.vars.req', []);
  const responseVars = get(collection, 'root.request.vars.res', []);
  const activeVarsCount = requestVars.filter((v) => v.enabled).length + responseVars.filter((v) => v.enabled).length;
  const authMode = get(collection, 'root.request.auth', {}).mode || 'none';

  const proxyConfig = get(collection, 'brunoConfig.proxy', {});
  const clientCertConfig = get(collection, 'brunoConfig.clientCertificates.certs', []);


  const onProxySettingsUpdate = (config) => {
    const brunoConfig = cloneDeep(collection.brunoConfig);
    brunoConfig.proxy = config;
    dispatch(updateBrunoConfig(brunoConfig, collection.uid))
      .then(() => {
        toast.success('Collection settings updated successfully.');
      })
      .catch((err) => console.log(err) && toast.error('Failed to update collection settings'));
  };

  const onClientCertSettingsUpdate = (config) => {
    const brunoConfig = cloneDeep(collection.brunoConfig);
    if (!brunoConfig.clientCertificates) {
      brunoConfig.clientCertificates = {
        enabled: true,
        certs: [config]
      };
    } else {
      brunoConfig.clientCertificates.certs.push(config);
    }
    dispatch(updateBrunoConfig(brunoConfig, collection.uid))
      .then(() => {
        toast.success('Collection settings updated successfully');
      })
      .catch((err) => console.log(err) && toast.error('Failed to update collection settings'));
  };

  const onClientCertSettingsRemove = (config) => {
    const brunoConfig = cloneDeep(collection.brunoConfig);
    brunoConfig.clientCertificates.certs = brunoConfig.clientCertificates.certs.filter(
      (item) => item.domain != config.domain
    );
    dispatch(updateBrunoConfig(brunoConfig, collection.uid))
      .then(() => {
        toast.success('Collection settings updated successfully');
      })
      .catch((err) => console.log(err) && toast.error('Failed to update collection settings'));
  };

  const getTabPanel = (tab) => {
    switch (tab) {
      case 'overview': {
        return <Overview collection={collection} />;
      }
      case 'headers': {
        return <Headers collection={collection} />;
      }
      case 'vars': {
        return <Vars collection={collection} />;
      }
      case 'auth': {
        return <Auth collection={collection} />;
      }
      case 'script': {
        return <Script collection={collection} />;
      }
      case 'tests': {
        return <Test collection={collection} />;
      }
      case 'presets': {
        return <Presets collection={collection} />;
      }
      case 'proxy': {
        return <ProxySettings proxyConfig={proxyConfig} onUpdate={onProxySettingsUpdate} />;
      }
      case 'clientCert': {
        return (
          <ClientCertSettings
            root={collection.pathname}
            clientCertConfig={clientCertConfig}
            onUpdate={onClientCertSettingsUpdate}
            onRemove={onClientCertSettingsRemove}
          />
        );
      }
    }
  };

  const getTabClassname = (tabName) => {
    return classnames(`tab select-none ${tabName}`, {
      active: tabName === tab
    });
  };

  return (
    <StyledWrapper className="flex flex-col h-full relative px-4 py-4">
      <div className="flex flex-wrap items-center tabs" role="tablist">
      <div className={getTabClassname('overview')} role="tab" onClick={() => setTab('overview')}>
          {t('CollectionSettings.Overview')}
        </div>
        <div className={getTabClassname('headers')} role="tab" onClick={() => setTab('headers')}>
          {t('CollectionSettings.Headers')}
          {activeHeadersCount > 0 && <sup className="ml-1 font-medium">{activeHeadersCount}</sup>}
        </div>
        <div className={getTabClassname('vars')} role="tab" onClick={() => setTab('vars')}>
          {t('CollectionSettings.Vars')}
          {activeVarsCount > 0 && <sup className="ml-1 font-medium">{activeVarsCount}</sup>}
        </div>
        <div className={getTabClassname('auth')} role="tab" onClick={() => setTab('auth')}>
          {t('CollectionSettings.Auth')}
          {authMode !== 'none' && <StatusDot />}
        </div>
        <div className={getTabClassname('script')} role="tab" onClick={() => setTab('script')}>
          {t('CollectionSettings.Script')}
          {hasScripts && <StatusDot />}
        </div>
        <div className={getTabClassname('tests')} role="tab" onClick={() => setTab('tests')}>
          {t('CollectionSettings.Tests')}
          {hasTests && <StatusDot />}
        </div>
        <div className={getTabClassname('presets')} role="tab" onClick={() => setTab('presets')}>{t('CollectionSettings.Presets')}</div>
        <div className={getTabClassname('proxy')} role="tab" onClick={() => setTab('proxy')}>
          {t('CollectionSettings.Proxy')}
          {Object.keys(proxyConfig).length > 0  && <StatusDot />}
        </div>
        <div className={getTabClassname('clientCert')} role="tab" onClick={() => setTab('clientCert')}>
          {t('CollectionSettings.Client_Certificates')}
          {clientCertConfig.length > 0 && <StatusDot />}
        </div>
      </div>
      <section className="mt-4 h-full">{getTabPanel(tab)}</section>
    </StyledWrapper>
  );
};

export default CollectionSettings;
