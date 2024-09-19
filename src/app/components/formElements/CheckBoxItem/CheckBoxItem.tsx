import React, { HTMLAttributes, MouseEvent } from 'react';
import styles from './checkBoxItem.module.css';
import classNames from 'classnames';
import CheckIcon from '../../images/Check';

interface PropType extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  label: string;
  selected: boolean;
  onChange: (selected: boolean, e: MouseEvent<HTMLButtonElement>) => void;
  type?: 'checkbox' | 'radio' | 'pill';
}

const CheckBoxItem: React.FC<PropType> = ({
  label,
  selected,
  type = 'checkbox',
  onChange,
  ...rest
}) => {
  const isTypeRadio = type === 'radio';

  return (
    <button
      type='button'
      className={classNames(styles.item, type === 'pill' && styles.pill)}
      onClick={(e) => {
        onChange(isTypeRadio ? true : !selected, e);
      }}
      {...rest}
    >
      {type === 'checkbox' && (
        <div
          role='checkbox'
          aria-checked={selected}
          aria-label={label}
          className={classNames(
            styles.input,
            styles.checkbox,
            selected && styles.checked
          )}
        >
          {selected && <CheckIcon className={styles.checkmark} />}
        </div>
      )}
      {isTypeRadio && (
        <div
          role='radio'
          aria-checked={selected}
          aria-label={label}
          className={classNames(
            styles.input,
            styles.radio,
            selected && styles.checked
          )}
        />
      )}
      <label>{label}</label>
    </button>
  );
};

export default CheckBoxItem;
