/**
 * Next.js server instrumentation.
 *
 * Azure Monitor / Application Insights is initialised only when a connection
 * string is present, so local development, CI, and tests stay offline. The
 * OpenTelemetry API is always safe to call: without this SDK it is a no-op.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  reportConfigHealth();

  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING?.trim();
  if (!connectionString) {
    return;
  }

  const [
    { BasicTracerProvider, BatchSpanProcessor },
    { AzureMonitorTraceExporter },
    { resourceFromAttributes },
    { trace },
  ] = await Promise.all([
    import('@opentelemetry/sdk-trace-base'),
    import('@azure/monitor-opentelemetry-exporter'),
    import('@opentelemetry/resources'),
    import('@opentelemetry/api'),
  ]);

  // `useAzureMonitor` from @azure/monitor-opentelemetry leaves the global tracer
  // provider unset in this app, so spans were created by a no-op tracer and never
  // exported. Registering the provider and the Azure Monitor exporter explicitly
  // keeps request traces flowing. Batches flush every second because serverless
  // instances can freeze shortly after the response is sent.
  const provider = new BasicTracerProvider({
    resource: resourceFromAttributes({ 'service.name': 'neurostudy-portal' }),
    spanProcessors: [
      new BatchSpanProcessor(new AzureMonitorTraceExporter({ connectionString }), {
        scheduledDelayMillis: 1000,
      }),
    ],
  });

  trace.setGlobalTracerProvider(provider);
}

/**
 * Logs the names of missing security secrets — never their values — so an
 * Azure Monitor alert can fire on `config_health` without leaking configuration.
 */
function reportConfigHealth(): void {
  const requiredSecrets = ['LEAD_COOKIE_SECRET', 'BOTID_COOKIE_SECRET'];
  const missing = requiredSecrets.filter((key) => (process.env[key]?.trim().length ?? 0) < 32);

  if (missing.length === 0) {
    return;
  }

  console.warn(
    JSON.stringify({
      event: 'config_health',
      level: 'warn',
      timestamp: new Date().toISOString(),
      missingSecrets: missing,
    }),
  );
}
