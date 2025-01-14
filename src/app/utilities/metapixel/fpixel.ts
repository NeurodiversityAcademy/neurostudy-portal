export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
type windowType = {
  fbq: (event: string, action: string, options?: unknown) => void;
};

const fbq = (window as unknown as windowType).fbq;
export const pageview = () => {
  fbq('track', 'PageView');
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: string, options = {}) => {
  fbq('track', name, options);
};
