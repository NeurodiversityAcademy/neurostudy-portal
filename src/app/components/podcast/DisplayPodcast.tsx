import React from 'react';
import BuzzsproutEmbed from './Buzzsprout';
import { BuzzsproutEmbedProps } from './Buzzsprout';
import { getBuzzsproutEmbedAvailability } from '@/app/utilities/buzzsproutFeed';

const DisplayPodcast: React.FC<BuzzsproutEmbedProps> = async ({
  scriptSrc,
  containerId,
  singleBlog,
}) => {
  const embedAvailable = await getBuzzsproutEmbedAvailability(
    scriptSrc,
    singleBlog
  );

  return (
    <BuzzsproutEmbed
      scriptSrc={scriptSrc}
      containerId={containerId}
      singleBlog={singleBlog}
      embedAvailable={embedAvailable}
    />
  );
};

export default DisplayPodcast;
