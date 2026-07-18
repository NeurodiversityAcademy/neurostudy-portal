import React from 'react';
import BuzzsproutEmbed from './Buzzsprout';
import { BuzzsproutEmbedProps } from './Buzzsprout';
import { getBuzzsproutEmbedAvailability } from '@/app/utilities/buzzsproutFeed';

const DisplayPodcast: React.FC<BuzzsproutEmbedProps> = async ({
  scriptSrc,
  containerId,
  singleBlog,
}) => {
  // Homepage/list players are intersection-lazy — skip blocking RSS feed checks.
  // Single-blog embeds still verify the script is reachable before painting.
  const embedAvailable = singleBlog
    ? await getBuzzsproutEmbedAvailability(scriptSrc, true)
    : true;

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
