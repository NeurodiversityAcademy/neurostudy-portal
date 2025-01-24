import React from 'react';
import BuzzsproutEmbed from './Buzzsprout';
import { BuzzsproutEmbedProps } from './Buzzsprout';

const DisplayPodcast: React.FC<BuzzsproutEmbedProps> = ({
  scriptSrc,
  containerId,
  singleBlog,
}) => {
  return (
    <>
      <BuzzsproutEmbed
        scriptSrc={scriptSrc}
        containerId={containerId}
        singleBlog={singleBlog}
      />
    </>
  );
};

export default DisplayPodcast;
