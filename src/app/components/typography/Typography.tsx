import React, { createElement } from 'react';
import styles from './typography.module.css';
import classNames from 'classnames';

export enum TypographyVariant {
  H1 = 'h1',
  H2 = 'h2', // Subheading
  H3 = 'h3', // Minor Subheading
  Body1 = 'body1',
  Body2Strong = 'body2-strong',
  Body2 = 'body2',
  Body3Strong = 'body3-strong',
  Body3 = 'body3',
  LABELtext = 'labelText',
}

interface TypographyProps {
  variant: TypographyVariant;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  role?: string;
  color?: string;
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  ariaLabel,
  ariaLabelledBy,
  role,
  color,
  className: rootClassName,
}) => {
  const style = color ? { color } : {};
  const props = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    role,
    style,
    className: '',
  };

  let tag = 'span';
  let variantClassName = styles.body1;

  switch (variant) {
    case TypographyVariant.H1:
      tag = 'h1';
      variantClassName = styles.heading1;
      break;
    case TypographyVariant.H2:
      tag = 'h2';
      variantClassName = styles.heading2;
      break;
    case TypographyVariant.H3:
      tag = 'h3';
      variantClassName = styles.heading3;
      break;
    case TypographyVariant.Body1:
      variantClassName = styles.body1;
      break;
    case TypographyVariant.Body2Strong:
      variantClassName = styles.body2Strong;
      break;
    case TypographyVariant.Body2:
      variantClassName = styles.body2;
      break;
    case TypographyVariant.Body3Strong:
      variantClassName = styles.body3Strong;
      break;
    case TypographyVariant.Body3:
      variantClassName = styles.body3;
      break;
    case TypographyVariant.LABELtext:
      variantClassName = styles.labelText;
      break;
  }

  props.className = classNames(styles.common, rootClassName, variantClassName);

  return createElement(tag, props, children);
};

export default Typography;
