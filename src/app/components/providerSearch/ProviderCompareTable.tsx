'use client';

import Link from 'next/link';
import type { CompareProviderPayload } from '@/app/utilities/leads/shortlistTypes';
import styles from './providerCompareTable.module.css';

function tierLabel(tier: CompareProviderPayload['tier']): string {
  if (tier === 'emerging') {
    return 'Emerging';
  }
  return tier === 'course_endorsed' ? 'NDA endorsed · courses' : 'NDA endorsed';
}

function valueOrDash(value: number | null): string {
  return value === null ? '—' : String(value);
}

export default function ProviderCompareTable({
  providers,
}: {
  providers: readonly CompareProviderPayload[];
}) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>
          Side-by-side comparison. No provider is marked best — use the facts to decide.
        </caption>
        <thead>
          <tr>
            <th scope='col' className={styles.rowHeader}>
              <span className={styles.visuallyHidden}>Attribute</span>
            </th>
            {providers.map((provider) => (
              <th key={provider.slug} scope='col' className={styles.providerHeader}>
                {provider.detailHref ? (
                  <Link className={styles.providerLink} href={provider.detailHref}>
                    {provider.name}
                  </Link>
                ) : (
                  provider.name
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope='row'>Status</th>
            {providers.map((provider) => (
              <td key={provider.slug}>{tierLabel(provider.tier)}</td>
            ))}
          </tr>
          <tr>
            <th scope='row'>Type</th>
            {providers.map((provider) => (
              <td key={provider.slug}>{provider.type}</td>
            ))}
          </tr>
          <tr>
            <th scope='row'>Location</th>
            {providers.map((provider) => (
              <td key={provider.slug}>{provider.locations.join(', ') || '—'}</td>
            ))}
          </tr>
          <tr>
            <th scope='row'>NDA certified</th>
            {providers.map((provider) => (
              <td key={provider.slug}>{provider.ndaCertified ? 'Yes' : 'No'}</td>
            ))}
          </tr>
          <tr>
            <th scope='row'>Supports in place</th>
            {providers.map((provider) => (
              <td key={provider.slug}>{valueOrDash(provider.supportInPlace)}</td>
            ))}
          </tr>
          <tr>
            <th scope='row'>Supports in the works</th>
            {providers.map((provider) => (
              <td key={provider.slug}>{valueOrDash(provider.supportInWorks)}</td>
            ))}
          </tr>
          <tr>
            <th scope='row'>Student experience</th>
            {providers.map((provider) => (
              <td key={provider.slug}>{provider.tier === 'emerging' ? 'Average' : 'Excellent'}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className={styles.detailGrid}>
        {providers.map((provider) => (
          <details key={provider.slug} className={styles.details}>
            <summary>{provider.name} — evidence detail</summary>
            {provider.supportSections.length > 0 ? (
              <div className={styles.detailBlock}>
                <h3 className={styles.detailHeading}>Support framework</h3>
                <div className={styles.supportSectionList}>
                  {provider.supportSections.map((section) => (
                    <section className={styles.supportSection} key={section.title}>
                      <h4 className={styles.supportSectionHeading}>{section.title}</h4>
                      <ul className={styles.detailList}>
                        {section.items.map((item) => (
                          <li key={item.label}>
                            {item.label}{' '}
                            <span className={styles.detailStatus}>({item.status})</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            ) : null}
            {provider.qilt ? (
              <div className={styles.detailBlock}>
                <h3 className={styles.detailHeading}>QILT student experience</h3>
                <ul className={styles.detailList}>
                  {provider.qilt.stats.map((stat) => (
                    <li key={stat.title}>
                      <span className={styles.detailSection}>{stat.title}:</span> {stat.value} vs
                      national average {stat.nationalAverage}
                      {stat.responses ? ` (n=${stat.responses})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </details>
        ))}
      </div>
    </div>
  );
}
