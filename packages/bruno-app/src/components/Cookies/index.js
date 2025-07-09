import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'components/Modal';
import Accordion from 'components/Accordion/index';
import { IconTrash, IconEdit, IconCirclePlus, IconCookieOff, IconAlertTriangle, IconSearch } from '@tabler/icons';
import { deleteCookiesForDomain, deleteCookie } from 'providers/ReduxStore/slices/app';
import toast from 'react-hot-toast';
import ModifyCookieModal from 'components/Cookies/ModifyCookieModal/index';
import StyledWrapper from './StyledWrapper';
import moment from 'moment';
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';

const ClearDomainCookiesModal = ({ onClose, domain, onClear }) => {
  const { t } = useTranslation();
  return (
  <Modal onClose={onClose} handleCancel={onClose} title="Clear Domain Cookies" hideFooter={true}>
    <div className="flex items-center font-normal">
      <IconAlertTriangle size={32} strokeWidth={1.5} className="text-yellow-600" />
      <h1 className="ml-2 text-lg font-semibold">Hold on..</h1>
    </div>
    <div className="font-normal mt-4">
      {t('Cookies.LongDescriptions1')} {domain}?
    </div>

    <div className="flex justify-between mt-6">
      <div>
        <button className="btn btn-sm btn-close" onClick={onClose}>{t('Cookies.Close')}</button>
      </div>
      <div>
        <button className="btn btn-sm btn-danger" onClick={onClear}>{t('Cookies.Clear_All')}</button>
      </div>
    </div>
  </Modal>
);
};

const DeleteCookieModal = ({ onClose, cookieName, onDelete }) => {
  const { t } = useTranslation();
  return (
    <Modal onClose={onClose} handleCancel={onClose} title="Delete Cookie" hideFooter={true}>
      <div className="flex items-center font-normal">
        <IconAlertTriangle size={32} strokeWidth={1.5} className="text-yellow-600" />
        <h1 className="ml-2 text-lg font-semibold">Hold on..</h1>
      </div>
      <div className="font-normal mt-4">
        {t('Cookies.LongDescriptions2')} {cookieName}?
      </div>

      <div className="flex justify-between mt-6">
        <div>
          <button className="btn btn-sm btn-close" onClick={onClose}>{t('Cookies.Close')}</button>
        </div>
        <div>
          <button className="btn btn-sm btn-danger" onClick={onDelete}>{t('Cookies.Delete')}</button>
        </div>
      </div>
    </Modal>
  );
};

const CollectionProperties = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cookies = useSelector((state) => state.app.cookies) || [];
  const [isModifyCookieModalOpen, setIsModifyCookieModalOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState(null);
  const [cookieToEdit, setCookieToEdit] = useState(null);

  const [domainToClear, setDomainToClear] = useState(null);
  const [cookieToDelete, setCookieToDelete] = useState(null);
  const [searchText, setSearchText] = useState(null);

  const handleAddCookie = (domain) => {
    if(domain) setCurrentDomain(domain);
    setIsModifyCookieModalOpen(true);
  };

  const handleEditCookie = (domain, cookie) => {
    setCurrentDomain(domain);
    setCookieToEdit(cookie);
    setIsModifyCookieModalOpen(true);
  };

  const handleClearDomainCookies = (domain) => {
    setDomainToClear(domain);
  };

  const clearDomainCookiesAction = () => {
    dispatch(deleteCookiesForDomain(domainToClear))
      .then(() => {
        toast.success('Domain cookies cleared successfully');
      })
      .catch((err) => console.log(err) && toast.error('Failed to clear domain cookies'));
    setDomainToClear(null);
  };

  const handleDeleteCookie = (domain, path, key) => {
    setCookieToDelete({ key, domain, path });
  };

  const deleteCookieAction = () => {
    if (cookieToDelete) {
      const { domain, path, key } = cookieToDelete;
      dispatch(deleteCookie(domain, path, key))
        .then(() => {
          toast.success('Cookie deleted successfully');
        })
        .catch((err) => console.log(err) && toast.error('Failed to delete cookie'));
    }
    setCookieToDelete(null);
  };

  const filteredCookies = useMemo(() => {
    if (!searchText) return cookies;

    return cookies.filter((cookie) =>
      cookie.domain.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [cookies, searchText]);

  const shouldShowHeader = cookies && cookies.length > 0;

  return (
    <>
      <Modal
        size="xl"
        title="Cookies"
        hideFooter={true}
        handleCancel={onClose}
        customHeader={shouldShowHeader ? (
          <StyledWrapper className="header flex items-center justify-between w-full">
            <h2 className="text-xs font-medium">{t('Cookies.Cookies')}</h2>
            <input
              type="search"
              placeholder="Search by domain"
              value={searchText || ''}
              onChange={(e) => setSearchText(e.target.value)}
              className="block textbox non-passphrase-input ml-auto font-normal"
            />
            <button
              type="submit"
              className="submit btn btn-sm btn-secondary flex items-center gap-1 mx-4 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                handleAddCookie();
              }}
            >
              <IconCirclePlus strokeWidth={1.5} size={16} />
              <span>{t('Cookies.Add_Cookie')}</span>
            </button>
          </StyledWrapper>
        ) : null}
      >
        <StyledWrapper>
          {!cookies || !cookies.length ? (
            // No cookies found
            <div className="flex items-center justify-center flex-col">
              <IconCookieOff size={48} strokeWidth={1.5} className="text-gray-500" />
              <h2 className="text-lg font-semibold mt-4">{t('Cookies.No_cookies_found')}</h2>
              <p className="text-gray-500 mt-2">{t('Cookies.Add_cookies_to_get_started')}</p>
              <button
                type="submit"
                className="submit btn btn-sm btn-secondary flex items-center gap-1 mt-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCookie();
                }}
              >
                <IconCirclePlus strokeWidth={1.5} size={16} />
                <span>{t('Cookies.Add_Cookie')}</span>
              </button>
            </div>
          ) : cookies.length && !filteredCookies.length ? (
            // No search results
            <div className="flex items-center justify-center flex-col">
              <IconSearch size={48} />
              <h2 className="text-lg font-semibold mt-4">{t('Cookies.No_search_results')}</h2>
              <p className="text-gray-500 mt-2">{t('Cookies.Try_a_different_search_term')}</p>
            </div>
          ) : (
            // Show cookies list
            <div className="scroll-box">
              <Accordion defaultIndex={0}>
                {filteredCookies.map((domainWithCookies, i) => (
                  <Accordion.Item key={i} index={i}>
                    <Accordion.Header index={i} className="flex items-center">
                      <div className="flex items-center">
                        <span>{domainWithCookies.domain}</span>
                        <span className="ml-2 text-xs dark:text-gray-300 text-gray-500">
                          ({domainWithCookies.cookies.length}{' '}
                          {domainWithCookies.cookies.length === 1 ? 'cookie' : 'cookies'})
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            type="submit"
                            className="flex items-center gap-1 text-gray-500 hover:text-gray-950 dark:text-white dark:hover:text-gray-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddCookie(domainWithCookies.domain);
                            }}
                          >
                            <IconCirclePlus strokeWidth={1.5} size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearDomainCookies(domainWithCookies.domain);
                            }}
                            className="text-gray-950 dark:text-white dark:hover:hover:text-red-600 hover:text-red-600  mr-2"
                          >
                            <IconTrash strokeWidth={1.5} size={16} />
                          </button>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Content index={i}>
                      <div className="flex items-center justify-between">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300">
                              <th className="py-2 px-4 font-semibold w-32">{t('Cookies.Name')}</th>
                              <th className="py-2 px-4 font-semibold w-52">{t('Cookies.Value')}</th>
                              <th className="py-2 px-4 font-semibold">{t('Cookies.Path')}</th>
                              <th className="py-2 px-4 font-semibold">{t('Cookies.Expires')}</th>
                              <th className="py-2 px-4 font-semibold text-center">{t('Cookies.Secure')}</th>
                              <th className="py-2 px-4 font-semibold text-center">{t('Cookies.HTTP_Only')}</th>
                              <th className="py-2 px-4 font-semibold text-right w-24">{t('Cookies.Actions')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {domainWithCookies.cookies.map((cookie) => (
                              <tr key={cookie.key} className="border-b border-gray-200 dark:border-neutral-600 last:border-none">
                                <td className="py-2 px-4 truncate">
                                  <span id={`cookie-key-${cookie.key}`}>{cookie.key}</span>
                                  <Tooltip
                                    anchorId={`cookie-key-${cookie.key}`}
                                    className="tooltip-mod"
                                    html={cookie.key}
                                  />
                                </td>
                                <td className="py-2 px-4 truncate">
                                  <span id={`cookie-value-${cookie.key}`}>{cookie.value}</span>
                                  <Tooltip
                                    anchorId={`cookie-value-${cookie.key}`}
                                    className="tooltip-mod"
                                    html={cookie.value}
                                  />
                                </td>
                                <td className="py-2 px-4 truncate">{cookie.path || '/'}</td>
                                <td className="py-2 px-4 truncate">
                                  <span id={`cookie-expires-${cookie.key}`}>
                                    {cookie.expires && moment(cookie.expires).isValid()
                                      ? new Date(cookie.expires).toLocaleString()
                                      : 'Session'}
                                  </span>
                                  {cookie.expires && moment(cookie.expires).isValid() && (
                                    <Tooltip
                                      anchorId={`cookie-expires-${cookie.key}`}
                                      className="tooltip-mod"
                                      html={new Date(cookie.expires).toLocaleString()}
                                    />
                                  )}
                                </td>
                                <td className="py-2 px-4 text-center">{cookie.secure ? '✓' : ''}</td>
                                <td className="py-2 px-4 text-center">{cookie.httpOnly ? '✓' : ''}</td>
                                <td className="py-2 px-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditCookie(domainWithCookies.domain, cookie);
                                      }}
                                      className="text-gray-700  hover:text-gray-950
                                    dark:text-white dark:hover:text-gray-300"
                                    >
                                      <IconEdit strokeWidth={1.5} size={16} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCookie(domainWithCookies.domain, cookie.path, cookie.key);
                                      }}
                                      className="text-gray-950 dark:text-white dark:hover:hover:text-red-600  hover:text-red-600"
                                    >
                                      <IconTrash strokeWidth={1.5} size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          )}
        </StyledWrapper>
      </Modal>
      {isModifyCookieModalOpen && (
        <ModifyCookieModal
          onClose={() => {
            setCookieToEdit(null);
            setCurrentDomain(null);
            setIsModifyCookieModalOpen(false);
          }}
          domain={currentDomain}
          cookie={cookieToEdit}
        />
      )}
      {domainToClear ? (
        <ClearDomainCookiesModal
          onClose={() => setDomainToClear(null)}
          domain={domainToClear}
          onClear={clearDomainCookiesAction}
        />
      ) : null}
      {cookieToDelete ? (
        <DeleteCookieModal
          onClose={() => setCookieToDelete(null)}
          cookieName={cookieToDelete.key}
          onDelete={deleteCookieAction}
        />
      ) : null}
    </>
  );
};

export default CollectionProperties;
