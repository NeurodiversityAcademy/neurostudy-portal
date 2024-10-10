import React, { createElement, HTMLAttributes } from 'react';
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

interface TypographyElement
  extends HTMLAttributes<HTMLHeadingElement | HTMLSpanElement> {}

interface TypographyProps extends TypographyElement {
  variant: TypographyVariant;
  children: React.ReactNode;
  color?: string;
}

const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  color,
  className,
  ...rest
}) => {
  const style = color ? { color } : {};

  let tag: 'span' | 'h1' | 'h2' | 'h3' = 'span';
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

  const props: TypographyElement = {
    style,
    ...rest,
    className: classNames(styles.common, variantClassName, className),
  };

  return createElement(tag, props, children);
};

export default Typography;
