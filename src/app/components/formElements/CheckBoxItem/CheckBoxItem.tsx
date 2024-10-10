import React, { ButtonHTMLAttributes, MouseEvent, useId } from 'react';
import styles from './checkBoxItem.module.css';
import classNames from 'classnames';
import CheckIcon from '../../images/Check';

interface PropType
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  label: string;
  checked: boolean;
  onChange: (selected: boolean, e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'checkbox' | 'radio' | 'pill';
}

const CheckBoxItem: React.FC<PropType> = ({
  label,
  checked,
  type = 'checkbox',
  disabled,
  onChange,
  className,
  onClick: _onClick,
  role,
  ...rest
}) => {
  const labelId = useId();

  const isTypeRadio = type === 'radio';
  const isTypeCheckbox = type === 'checkbox';
  const isTypePill = type === 'pill';

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const newSelected = isTypeRadio ? true : !checked;
    newSelected !== checked && onChange(newSelected, e);
    _onClick?.(e);
  };

  return (
    <button
      type='button'
      disabled={disabled}
      className={classNames(styles.item, isTypePill && styles.pill, className)}
      onClick={onClick}
      role={role}
      {...(role === 'option' && { 'aria-selected': checked })}
      {...rest}
    >
      {isTypeCheckbox || isTypeRadio ? (
        <div
          aria-disabled={disabled}
          className={classNames(
            styles.input,
            styles[type],
            checked && styles.checked
          )}
          {...(role === 'option'
            ? { 'aria-hidden': true }
            : {
                role: type,
                'aria-checked': checked,
                'aria-labelledby': labelId,
              })}
        >
          {isTypeCheckbox && checked && (
            <CheckIcon aria-hidden className={styles.checkmark} />
          )}
        </div>
      ) : null}
      <label id={labelId}>{label}</label>
    </button>
  );
};

export default CheckBoxItem;
