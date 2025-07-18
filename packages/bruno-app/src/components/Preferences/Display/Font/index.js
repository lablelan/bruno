import React, { useState } from 'react';
import get from 'lodash/get';
import { useSelector, useDispatch } from 'react-redux';
import { savePreferences } from 'providers/ReduxStore/slices/app';
import StyledWrapper from './StyledWrapper';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Font = ({ close }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.app.preferences);

  const [codeFont, setCodeFont] = useState(get(preferences, 'font.codeFont', 'default'));
  const [codeFontSize, setCodeFontSize] = useState(get(preferences, 'font.codeFontSize', '14'));

  const handleCodeFontChange = (event) => {
    setCodeFont(event.target.value);
  };

  const handleCodeFontSizeChange = (event) => {
    // Restrict to min/max value
    const clampedSize = Math.max(1, Math.min(event.target.value, 32));
    setCodeFontSize(clampedSize);
  };

  const handleSave = () => {
    dispatch(
      savePreferences({
        ...preferences,
        font: {
          codeFont,
          codeFontSize
        }
      })
    ).then(() => {
      toast.success('Preferences saved successfully')
      close();
    }).catch(() => {
      toast.error('Failed to save preferences')
    });
  };

  return (
    <StyledWrapper>
      <div className="flex flex-row gap-2 w-full">
        <div className="w-4/5">
          <label className="block">{t('Preferences_Display_Font.Code_Editor_Font')}</label>
          <input
            type="text"
            className="block textbox mt-2 w-full"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={handleCodeFontChange}
            defaultValue={codeFont}
          />
        </div>
        <div className="w-1/5">
          <label className="block">{t('Preferences_Display_Font.Font_Size')}</label>
          <input
            type="number"
            className="block textbox mt-2 w-full"
            autoComplete="off"
            autoCorrect="off"
            inputMode="numeric"
            onChange={handleCodeFontSizeChange}
            defaultValue={codeFontSize}
          />
        </div>
      </div>

      <div className="mt-10">
        <button type="submit" className="submit btn btn-sm btn-secondary" onClick={handleSave}>{t('Preferences_Display_Font.Save')}</button>
      </div>
    </StyledWrapper>
  );
};

export default Font;
