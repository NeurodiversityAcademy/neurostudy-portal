// can be deleted later
import React from 'react';
import Typography, { TypographyVariant } from './Typography';

const ExampleComponent = () => {
  return (
    <div>
      <Typography variant={TypographyVariant.H1}>Heading 1 Text</Typography>
      <br />
      <Typography variant={TypographyVariant.H2}>Subheading Text</Typography>
      <br />
      <Typography variant={TypographyVariant.Body1}>Body 1 Text</Typography>
      <br />
      <Typography variant={TypographyVariant.Body2Strong}>Body 2 Strong Text</Typography>
      <br />
      <Typography variant={TypographyVariant.Body2}>Body 2 Text</Typography>
    </div>
  );
};

export default ExampleComponent;
