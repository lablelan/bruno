import QueryResult from "components/ResponsePane/QueryResult/index";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const BodyBlock = ({ collection, data, dataBuffer, headers, error, item }) => {
  const { t } = useTranslation();
  const [isBodyCollapsed, toggleBody] = useState(true);
  return (
    <div className="collapsible-section">
    <div className="section-header" onClick={() => toggleBody(!isBodyCollapsed)}>
      <pre className="flex flex-row items-center text-indigo-500/80 dark:text-indigo-500/80">
        <div className="opacity-70">{isBodyCollapsed ? '▼' : '▶'}</div> Body
      </pre>
    </div>
    {isBodyCollapsed && (
      <div className="mt-2">
        {data || dataBuffer ? (
          <div className="h-96 overflow-auto">
            <QueryResult
              item={item}
              collection={collection}
              data={data}
              dataBuffer={dataBuffer}
              headers={headers}
              error={error}
              key={item?.uid}
            />
          </div>
        ) : (
          <div className="text-gray-500">{t('ResponsePane_Timeline_TimelineItem_Common_Body.No_Body_found')}</div>
        )}
      </div>
    )}
  </div>
  )
}

export default BodyBlock;