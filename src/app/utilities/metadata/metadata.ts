import { HOST_URL, META_KEY, META_TYPE } from '../constants';
import {
  KEYWORDS_ABOUT,
  KEYWORDS_ARTICLES,
  KEYWORDS_BLOGS,
  KEYWORDS_CONTACT,
  KEYWORDS_ENDORSEMENTS,
  KEYWORDS_HOME,
  KEYWORDS_LOGIN,
  KEYWORDS_NEURODIVERGENT_MATES,
  KEYWORDS_SIGNUP,
  KEYWORDS_FORGOT_PASSWORD,
  KEYWORDS_PROFILE,
  KEYWORDS_COURSES,
} from './keywords';
import { MetadataParams } from '@/app/interfaces/MetadataProps';

export const META_COURSES_DEFAULT_CANONICAL_URL = `${HOST_URL}/courses`;

export const metadata: Record<string, Partial<MetadataParams>> = {
  [META_KEY.HOME]: {
    title: 'Homepage - Neurodiversity Academy',
    description: 'Homepage for Neurodiversity Academy',
    keywords: KEYWORDS_HOME,
    canonical: `${HOST_URL}/`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.NEURODIVERGENT_MATES]: {
    title: 'Neurodivergent Mates',
    description:
      'Neurodivergent Mates is two neurodivergent mates from Australia who get together with different members of the community to talk and have in-depth conversations',
    keywords: KEYWORDS_HOME + KEYWORDS_NEURODIVERGENT_MATES,
    canonical: `${HOST_URL}/neurodivergentmates`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.ABOUT]: {
    title: 'About',
    description: 'About Neurodiversity Academy',
    keywords: KEYWORDS_ABOUT,
    canonical: `${HOST_URL}/about`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.CONTACT]: {
    title: 'Contact',
    description: 'Contact page allows customers to contact Neurodiversity Academy',
    keywords: KEYWORDS_CONTACT,
    canonical: `${HOST_URL}/contact`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.ARTICLES]: {
    title: 'Articles',
    description: 'Articles from Neurodiversity Academy',
    keywords: KEYWORDS_ARTICLES,
    canonical: `${HOST_URL}/articles`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.ARTICLE]: {
    title: '',
    description: '',
    keywords: '',
    canonical: '',
    type: META_TYPE.ARTICLE,
  },
  [META_KEY.BLOGS]: {
    title: 'Blogs',
    description: 'Blogs from Neurodiversity Academy',
    keywords: KEYWORDS_BLOGS,
    canonical: `${HOST_URL}/blogs`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.BLOG]: {
    title: '',
    description: '',
    keywords: '',
    canonical: '',
    type: META_TYPE.ARTICLE,
  },
  [META_KEY.SIGNUP]: {
    title: 'Sign up - Neurodiversity Academy',
    description: 'Sign up page for Neurodiversity Academy',
    keywords: KEYWORDS_SIGNUP,
    canonical: `${HOST_URL}/signup`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.LOGIN]: {
    title: 'Log in - Neurodiversity Academy',
    description: 'Log in page for Neurodiversity Academy',
    keywords: KEYWORDS_LOGIN,
    canonical: `${HOST_URL}/login`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.FORGOT_PASSWORD]: {
    title: 'Forgot password - Neurodiversity Academy',
    description: 'Forgot password page for Neurodiversity Academy',
    keywords: KEYWORDS_FORGOT_PASSWORD,
    canonical: `${HOST_URL}/forgotpassword`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.PROFILE]: {
    title: 'User Profile - Neurodiversity Academy',
    description: 'Profile page of a user',
    keywords: KEYWORDS_PROFILE,
    canonical: `${HOST_URL}/profile`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.COURSES]: {
    title: 'Courses - Neurodiversity Academy',
    description: 'Search courses associated with Neurodiversity Academy',
    keywords: KEYWORDS_COURSES,
    canonical: META_COURSES_DEFAULT_CANONICAL_URL,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.ENDORSEMENTS]: {
    title: 'Endorsements - Neurodiversity Academy',
    description:
      "Endorsement ensures that learning organisations meet the Neurodiversity Academy's (NDA) neuro-inclusion standards. Only endorsed providers are eligible to appear on our platform, giving students confidence that these organisations are prepared to support neurodivergent learners effectively.",
    keywords: KEYWORDS_ENDORSEMENTS,
    canonical: `${HOST_URL}/endorsements`,
    type: META_TYPE.WEBSITE,
  },
};
