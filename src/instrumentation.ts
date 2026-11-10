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

  const { useAzureMonitor: startAzureMonitor } = await import('@azure/monitor-opentelemetry');

  startAzureMonitor({
    azureMonitorExporterOptions: { connectionString },
    samplingRatio: 1,
    enableLiveMetrics: false,
    instrumentationOptions: {
      // Vercel already captures function logs; avoid duplicating every console
      // line into App Insights. Structured request traces are sent explicitly.
      console: { enabled: false },
    },
  });
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
