import React from 'react';
import Typography, { TypographyVariant } from '../typography/Typography';

type VlogInterface = {
  podcastLink: string;
};

const Vlog: React.FC<VlogInterface> = ({ podcastLink }: VlogInterface) => (
  <>
    <Typography variant={TypographyVariant.H3} color='var(--BondBlack)'>
      Please subscribe to our YouTube Channel and Watch the full episode of this
      Neurodivergent Mates Podcast
    </Typography>
    <iframe
      width='65%'
      height='315'
      src={podcastLink}
      title='Neurodivergent Mates'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      referrerPolicy='strict-origin-when-cross-origin'
      allowFullScreen
    />
  </>
);

export default Vlog;
