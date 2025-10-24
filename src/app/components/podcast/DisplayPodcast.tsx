import React from 'react';
import BuzzsproutEmbed from './Buzzsprout';
import { BuzzsproutEmbedProps } from './Buzzsprout';

const DisplayPodcast: React.FC<BuzzsproutEmbedProps> = ({
  scriptSrc,
  containerId,
  singleBlog,
}) => {
  return (
    <div id='buzzsproutembed'>
      <BuzzsproutEmbed
        scriptSrc={scriptSrc}
        containerId={containerId}
        singleBlog={singleBlog}
      />
    </div>
  );
};

export default DisplayPodcast;
