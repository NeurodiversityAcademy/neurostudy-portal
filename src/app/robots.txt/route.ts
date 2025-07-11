export function GET() {
  return new Response(
    `User-agent: *
Disallow:

Sitemap: https://neurodiversityacademy.com/sitemap.xml
`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
}
