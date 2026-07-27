import { sendGaEvent } from '@/app/utilities/gaTracking';
import {
  buildEmergingDirectoryViewAllAnalytics,
  buildEmergingExploreMoreAnalytics,
  EMERGING_GA_SURFACE,
  EMERGING_PROVIDERS_GA,
  trackEmergingInstitutePillClick,
  trackEmergingStateAutoSelect,
  trackEmergingStateJump,
  trackEmergingStateSelect,
} from '../emergingProvidersGa';

jest.mock('@/app/utilities/gaTracking', () => ({
  sendGaEvent: jest.fn(),
}));

const sendGaEventMock = sendGaEvent as jest.MockedFunction<typeof sendGaEvent>;

describe('emergingProvidersGa', () => {
  beforeEach(() => {
    sendGaEventMock.mockClear();
  });

  it('tracks state auto-select', () => {
    trackEmergingStateAutoSelect('VIC');
    expect(sendGaEventMock).toHaveBeenCalledWith(
      EMERGING_PROVIDERS_GA.stateAutoSelect.eventName,
      expect.objectContaining({
        category: 'Emerging',
        surface: EMERGING_GA_SURFACE.homepageTeaser,
        state: 'VIC',
        page_path: expect.any(String),
      }),
    );
  });

  it('tracks state select with was_already_selected', () => {
    trackEmergingStateSelect({ state: 'NSW', wasAlreadySelected: true });
    expect(sendGaEventMock).toHaveBeenCalledWith(
      EMERGING_PROVIDERS_GA.stateSelect.eventName,
      expect.objectContaining({
        state: 'NSW',
        was_already_selected: true,
        surface: EMERGING_GA_SURFACE.homepageTeaser,
      }),
    );
  });

  it('tracks institute pill click', () => {
    trackEmergingInstitutePillClick({
      providerName: 'Bond University',
      providerSlug: 'bond-university',
      state: 'QLD',
      destinationPath: '/emergingproviders/bond-university',
      linkText: 'Bond University',
    });
    expect(sendGaEventMock).toHaveBeenCalledWith(
      EMERGING_PROVIDERS_GA.institutePillClick.eventName,
      expect.objectContaining({
        provider_name: 'Bond University',
        provider_slug: 'bond-university',
        state: 'QLD',
        destination_path: '/emergingproviders/bond-university',
      }),
    );
  });

  it('tracks state jump with source', () => {
    trackEmergingStateJump({ state: 'SA', source: 'deep_link' });
    expect(sendGaEventMock).toHaveBeenCalledWith(
      EMERGING_PROVIDERS_GA.stateJump.eventName,
      expect.objectContaining({
        state: 'SA',
        source: 'deep_link',
        surface: EMERGING_GA_SURFACE.emergingDirectory,
      }),
    );
  });

  it('builds explore more and view-all analytics payloads', () => {
    expect(
      buildEmergingExploreMoreAnalytics({
        providerName: 'Bond University',
        providerSlug: 'bond-university',
        state: 'QLD',
        destinationPath: '/emergingproviders/bond-university',
      }),
    ).toEqual(
      expect.objectContaining({
        eventName: EMERGING_PROVIDERS_GA.ctaClick.eventName,
        params: expect.objectContaining({
          surface: EMERGING_GA_SURFACE.emergingDirectory,
          provider_slug: 'bond-university',
        }),
      }),
    );

    expect(buildEmergingDirectoryViewAllAnalytics()).toEqual(
      expect.objectContaining({
        eventName: EMERGING_PROVIDERS_GA.directoryCtaClick.eventName,
        params: expect.objectContaining({
          destination_path: '/emergingproviders',
          surface: EMERGING_GA_SURFACE.homepageTeaser,
        }),
      }),
    );
  });
});
