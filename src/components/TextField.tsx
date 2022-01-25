import { useState, useEffect, MouseEvent, ChangeEvent } from 'react';

// Styles
import '../styles/components/TextField.css';

const TextField = ({
  label,
  text,
  sendValue,
}: {
  label: string;
  text: string;
  sendValue: (value: number | undefined) => void;
}) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [isError, setIsError] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [errorMes, setErrorMes] = useState<string>('');

  // Set state to parent after done input
  useEffect(() => {
    if (!isError && value !== undefined) {
      sendValue(Number(value));
    }

    if (value === '') {
      sendValue(undefined);
    }
  }, [isError, value]);

  const handleChangeValue = (e: ChangeEvent) => {
    const currentValue = (e.target as HTMLInputElement).value;

    setIsFilled(currentValue.length > 0);
    setValue(currentValue);

    // Number validation
    if (Number(currentValue) >= 0) {
      setIsError(false);
    } else {
      setIsError(true);
      setErrorMes('Input must equal or larger than 0');
    }
  };

  // Clear input filed when click x button
  const handleResetField = (e: MouseEvent) => {
    e.preventDefault();

    setValue('');
    setIsError(false);
    setIsFilled(false);
  };

  return (
    <div className="input-con">
      <input
        type="text"
        className={`input-con__input ${
          isFilled ? 'input-con__input--filled' : ''
        } ${isError && isFilled ? 'input-con__input--not-valid' : ''}`}
        name={label}
        value={value}
        onChange={handleChangeValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        required
      />
      <label
        htmlFor={label}
        className={`input-con__label ${
          isFocus || isFilled ? 'input-con__label--filled' : ''
        } ${isError && isFilled ? 'input-con__label--not-valid' : ''}`}
      >
        {text}
      </label>
      {isError && isFilled ? (
        <p className={`input-con__p`}>{errorMes}</p>
      ) : null}
      {isFilled && (
        <button
          className={`input-con__btn ${
            isError ? 'input-con__btn--not-valid' : ''
          }`}
          onClick={handleResetField}
        >
          x
        </button>
      )}
    </div>
  );
};

export default TextField;
