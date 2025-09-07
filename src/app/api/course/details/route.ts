import GET from './GET';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const revalidate = 0;

export { /* @next-codemod-error `GET` export is re-exported. Check if this component uses `params` or `searchParams`*/
GET };
