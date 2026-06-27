const BUZZSPROUT_FEED_URL = 'https://feeds.buzzsprout.com/2132579.rss';

const FEED_REVALIDATE_SECONDS = 3600;
const SCRIPT_REVALIDATE_SECONDS = 3600;

export const BUZZSPROUT_SHOW_URL = 'https://www.buzzsprout.com/2132579';
export const NEURODIVERGENT_MATES_PATH = '/neurodivergentmates';

export async function buzzsproutFeedHasEpisodes(): Promise<boolean> {
  try {
    const response = await fetch(BUZZSPROUT_FEED_URL, {
      next: { revalidate: FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return true;
    }

    const feed = await response.text();
    return feed.includes('<item>');
  } catch {
    return true;
  }
}

async function buzzsproutScriptIsAvailable(
  scriptSrc: string
): Promise<boolean> {
  try {
    const response = await fetch(scriptSrc, {
      method: 'HEAD',
      next: { revalidate: SCRIPT_REVALIDATE_SECONDS },
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function getBuzzsproutEmbedAvailability(
  scriptSrc: string,
  singleBlog: boolean
): Promise<boolean> {
  if (singleBlog) {
    return buzzsproutScriptIsAvailable(scriptSrc);
  }

  return buzzsproutFeedHasEpisodes();
}
