import React, { ButtonHTMLAttributes, MouseEvent } from 'react';
import styles from './checkBoxItem.module.css';
import classNames from 'classnames';
import CheckIcon from '../../images/Check';

interface PropType
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  label: string;
  selected: boolean;
  onChange: (selected: boolean, e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'checkbox' | 'radio' | 'pill';
}

const CheckBoxItem: React.FC<PropType> = ({
  label,
  selected,
  type = 'checkbox',
  disabled,
  onChange,
  onClick: _onClick,
  ...rest
}) => {
  const isTypeRadio = type === 'radio';
  const isTypeCheckbox = type === 'checkbox';
  const isTypePill = type === 'pill';

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const newSelected = isTypeRadio ? true : !selected;
    newSelected !== selected && onChange(newSelected, e);
    _onClick?.(e);
  };

  return (
    <button
      type='button'
      disabled={disabled}
      className={classNames(styles.item, isTypePill && styles.pill)}
      onClick={onClick}
      {...rest}
    >
      {isTypeCheckbox || isTypeRadio ? (
        <div
          role={type}
          aria-disabled={disabled}
          aria-checked={selected}
          aria-label={label}
          className={classNames(
            styles.input,
            styles[type],
            selected && styles.checked
          )}
        >
          {isTypeCheckbox && selected && (
            <CheckIcon className={styles.checkmark} />
          )}
        </div>
      ) : null}
      <label>{label}</label>
    </button>
  );
};

export default CheckBoxItem;
