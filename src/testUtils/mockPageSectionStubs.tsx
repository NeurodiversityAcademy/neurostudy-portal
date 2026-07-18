/**
 * Shared page/section stubs for composition tests (e.g. endorsements page).
 *
 * Usage:
 *   jest.mock('../components/fact/Fact', () =>
 *     require('@/testUtils/mockPageSectionStubs').mockFact,
 *   );
 */
import { createStubModule } from './createStubComponent';

export const mockHomeBanner = createStubModule('home-banner');
export const mockTeacher = createStubModule('teacher');
export const mockHandbook = createStubModule('handbook');
export const mockFact = createStubModule('fact');
export const mockEndorsementProcess = createStubModule('endorsement-process');
export const mockPartner = createStubModule('partner');
export const mockDisplayPodcast = createStubModule('podcast');
export const mockArticleList = createStubModule('article-list');
export const mockSubscribe = createStubModule('subscribe');
