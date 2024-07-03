import { HOST_URL, META_KEY, META_TYPE } from '../constants';
import {
  KEYWORDS_ABOUT,
  KEYWORDS_ADVISORY_CONSULTING,
  KEYWORDS_ARTICLES,
  KEYWORDS_BLOGS,
  KEYWORDS_COACHING,
  KEYWORDS_CONTACT,
  KEYWORDS_HOME,
  KEYWORDS_LOGIN,
  KEYWORDS_NETWORKING,
  KEYWORDS_NEURODIVERGENT_MATES,
  KEYWORDS_NEURODIVERSITY_TRAINING,
  KEYWORDS_PLACEMENTS,
  KEYWORDS_SIGNUP,
} from './keywords';

export const metadata = {
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
  [META_KEY.NEURODIVERSITY_TRAINING]: {
    title: 'Learning/Training Partnerships',
    description:
      'Learning/Training Partnerships services from Neurodiversity Academy',
    keywords:
      KEYWORDS_HOME +
      KEYWORDS_NEURODIVERGENT_MATES +
      KEYWORDS_NEURODIVERSITY_TRAINING,
    canonical: `${HOST_URL}/services/neurodiversitytraining`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.ADVISORY_CONSULTING]: {
    title: 'Advisory Neurodiversity Consulting',
    description:
      'Advisory Neurodiversity Consulting services from Neurodiversity Academy',
    keywords:
      KEYWORDS_HOME +
      KEYWORDS_NEURODIVERGENT_MATES +
      KEYWORDS_ADVISORY_CONSULTING,
    canonical: `${HOST_URL}/services/advisoryconsulting`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.NETWORKING]: {
    title: 'Host Neurodiversity Workshops & Networking (Awareness/Education)',
    description:
      'Hosting Neurodiversity Workshops & Networking services from Neurodiversity Academy',
    keywords:
      KEYWORDS_HOME + KEYWORDS_NEURODIVERGENT_MATES + KEYWORDS_NETWORKING,
    canonical: `${HOST_URL}/services/networking`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.COACHING]: {
    title: 'Career Coaching',
    description: 'Neurodiversity Career Coaching from Neurodiversity Academy',
    keywords: KEYWORDS_HOME + KEYWORDS_NEURODIVERGENT_MATES + KEYWORDS_COACHING,
    canonical: `${HOST_URL}/services/coaching`,
    type: META_TYPE.WEBSITE,
  },
  [META_KEY.PLACEMENTS]: {
    title: 'Placements (Internships/Employment)',
    description:
      'Placements (Internships/Employment) services from Neurodiversity Academy',
    keywords:
      KEYWORDS_HOME + KEYWORDS_NEURODIVERGENT_MATES + KEYWORDS_PLACEMENTS,
    canonical: `${HOST_URL}/services/placements`,
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
    description:
      'Contact page allows customers to contact Neurodiversity Academy',
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
};
