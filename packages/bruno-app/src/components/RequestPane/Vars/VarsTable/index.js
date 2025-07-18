import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { IconTrash } from '@tabler/icons';
import { useDispatch } from 'react-redux';
import { useTheme } from 'providers/Theme';
import { addVar, updateVar, deleteVar, moveVar } from 'providers/ReduxStore/slices/collections';
import { sendRequest, saveRequest } from 'providers/ReduxStore/slices/collections/actions';
import SingleLineEditor from 'components/SingleLineEditor';
import InfoTip from 'components/InfoTip';
import StyledWrapper from './StyledWrapper';
import toast from 'react-hot-toast';
import { variableNameRegex } from 'utils/common/regex';
import Table from 'components/Table/index';
import ReorderTable from 'components/ReorderTable/index';
import { useTranslation } from 'react-i18next';

const VarsTable = ({ item, collection, vars, varType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { storedTheme } = useTheme();

  const handleAddVar = () => {
    dispatch(
      addVar({
        type: varType,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const onSave = () => dispatch(saveRequest(item.uid, collection.uid));
  const handleRun = () => dispatch(sendRequest(item, collection.uid));
  const handleVarChange = (e, v, type) => {
    const _var = cloneDeep(v);
    switch (type) {
      case 'name': {
        const value = e.target.value;

        if (variableNameRegex.test(value) === false) {
          toast.error(
            'Variable contains invalid characters! Variables must only contain alpha-numeric characters, "-", "_", "."'
          );
          return;
        }

        _var.name = value;
        break;
      }
      case 'value': {
        _var.value = e.target.value;
        break;
      }
      case 'enabled': {
        _var.enabled = e.target.checked;
        break;
      }
    }
    dispatch(
      updateVar({
        type: varType,
        var: _var,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const handleRemoveVar = (_var) => {
    dispatch(
      deleteVar({
        type: varType,
        varUid: _var.uid,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const handleVarDrag = ({ updateReorderedItem }) => {
    dispatch(
      moveVar({
        type: varType,
        collectionUid: collection.uid,
        itemUid: item.uid,
        updateReorderedItem
      })
    );
  };

  return (
    <StyledWrapper className="w-full">
      <Table
        headers={[
          { name: 'Name', accessor: 'name', width: '40%' },
          { name: varType === 'request' ? (
              <div className="flex items-center">
                <span>{t('RequestPane_Vars_VarsTable.Value')}</span>
              </div>
          ) : (
              <div className="flex items-center">
                <span>{t('RequestPane_Vars_VarsTable.Expr')}</span>
                <InfoTip content="You can write any valid JS expression here" infotipId="response-var" />
              </div>
          ), accessor: 'value', width: '46%' },
          { name: '', accessor: '', width: '14%' }
        ]}
      >
        <ReorderTable updateReorderedItem={handleVarDrag}>
        {vars && vars.length
            ? vars.map((_var) => {
                return (
                  <tr key={_var.uid} data-uid={_var.uid}>
                    <td className='flex relative'>
                      <input
                        type="text"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        value={_var.name}
                        className="mousetrap"
                        onChange={(e) => handleVarChange(e, _var, 'name')}
                      />
                    </td>
                    <td>
                      <SingleLineEditor
                        value={_var.value}
                        theme={storedTheme}
                        onSave={onSave}
                        onChange={(newValue) =>
                          handleVarChange(
                            {
                              target: {
                                value: newValue
                              }
                            },
                            _var,
                            'value'
                          )
                        }
                        onRun={handleRun}
                        collection={collection}
                        item={item}
                      />
                    </td>
                    <td>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={_var.enabled}
                          tabIndex="-1"
                          className="mr-3 mousetrap"
                          onChange={(e) => handleVarChange(e, _var, 'enabled')}
                        />
                        <button tabIndex="-1" onClick={() => handleRemoveVar(_var)}>
                          <IconTrash strokeWidth={1.5} size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            : null}
        </ReorderTable>
      </Table>
      <button className="btn-add-var text-link pr-2 py-3 mt-2 select-none" onClick={handleAddVar}>
        {t('RequestPane_Vars_VarsTable.Add')}
      </button>
    </StyledWrapper>
  );
};
export default VarsTable;
