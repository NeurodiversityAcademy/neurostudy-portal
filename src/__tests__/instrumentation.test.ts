const mockSetGlobalTracerProvider = jest.fn();
const mockProviderConfig = jest.fn();
const mockExporterOptions = jest.fn();
const mockBatchOptions = jest.fn();

jest.mock('@opentelemetry/sdk-trace-base', () => ({
  BasicTracerProvider: jest.fn().mockImplementation((config: unknown) => {
    mockProviderConfig(config);
    return { id: 'provider' };
  }),
  BatchSpanProcessor: jest.fn().mockImplementation((exporter: unknown, options: unknown) => {
    mockBatchOptions(options);
    return { exporter, options };
  }),
}));

jest.mock('@azure/monitor-opentelemetry-exporter', () => ({
  AzureMonitorTraceExporter: jest.fn().mockImplementation((options: unknown) => {
    mockExporterOptions(options);
    return { id: 'exporter' };
  }),
}));

jest.mock('@opentelemetry/resources', () => ({
  resourceFromAttributes: jest.fn((attributes: unknown) => ({ attributes })),
}));

jest.mock('@opentelemetry/api', () => ({
  trace: { setGlobalTracerProvider: mockSetGlobalTracerProvider },
}));

import { register } from '../instrumentation';

const ORIGINAL_ENV = { ...process.env };

describe('server instrumentation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_RUNTIME: 'nodejs',
      LEAD_COOKIE_SECRET: 'x'.repeat(40),
      BOTID_COOKIE_SECRET: 'x'.repeat(40),
    };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.restoreAllMocks();
  });

  it('stays offline outside the node runtime', async () => {
    process.env.NEXT_RUNTIME = 'edge';
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = 'InstrumentationKey=test';

    await register();

    expect(mockSetGlobalTracerProvider).not.toHaveBeenCalled();
  });

  it('stays offline without a connection string', async () => {
    delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

    await register();

    expect(mockSetGlobalTracerProvider).not.toHaveBeenCalled();
  });

  it('registers an Azure Monitor exporter as the global tracer provider', async () => {
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = ' InstrumentationKey=test ';

    await register();

    expect(mockExporterOptions).toHaveBeenCalledWith({
      connectionString: 'InstrumentationKey=test',
    });
    expect(mockBatchOptions).toHaveBeenCalledWith({ scheduledDelayMillis: 1000 });
    expect(mockProviderConfig).toHaveBeenCalledWith({
      resource: { attributes: { 'service.name': 'neurostudy-portal' } },
      spanProcessors: [{ exporter: { id: 'exporter' }, options: { scheduledDelayMillis: 1000 } }],
    });
    expect(mockSetGlobalTracerProvider).toHaveBeenCalledTimes(1);
  });

  it('names missing secrets without logging their values', async () => {
    delete process.env.LEAD_COOKIE_SECRET;

    await register();

    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('config_health'));
  });
});
