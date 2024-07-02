import Typography, { TypographyVariant } from '../../typography/Typography';
import { FieldValues, Path } from 'react-hook-form';

interface LabelProps {
  name: Path<FieldValues>;
  color: string;
  label: string;
  required: boolean;
}

const Label = ({ name, color, label, required }: Partial<LabelProps>) => {
  return (
    <label htmlFor={name}>
      <Typography variant={TypographyVariant.Body2} color={color}>
        {label}
        {required && '* '}
        {required && (
          <Typography variant={TypographyVariant.LABELtext} color='var(--grey)'>
            (required)
          </Typography>
        )}
      </Typography>
    </label>
  );
};

export default Label;
