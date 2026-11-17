import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { build } from 'esbuild';

const root = process.cwd();
const fixture = await mkdtemp(path.join(tmpdir(), 'cms-next-cache-'));
const secret = 'integration-cache-secret-0123456789-abcdef';
const counts = new Map();
const records = new Map([
  ['old', 'initial'],
  ['unrelated', 'untouched'],
]);
let server;
let logs = '';
const cms = createServer(async (request, response) => {
  let body = '';
  for await (const chunk of request) body += chunk;
  const { operationName, variables } = JSON.parse(body);
  const key = `${operationName}:${variables?.slug ?? ''}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
  response.setHeader('Content-Type', 'application/json');
  const tools =
    operationName === 'PublishedToolsMaster'
      ? [...records].map(([slug, title]) => ({ slug, title }))
      : records.has(variables?.slug)
        ? [{ slug: variables.slug, title: records.get(variables.slug) }]
        : [];
  response.end(
    JSON.stringify({
      data:
        operationName === 'PublishedPrivacyPolicy'
          ? { privacyPolicy: { title: 'unchanged policy' } }
          : { tools },
    }),
  );
});
await new Promise((resolve) => cms.listen(0, '127.0.0.1', resolve));
const cmsUrl = `http://127.0.0.1:${cms.address().port}/graphql`;
const freePort = createServer();
await new Promise((resolve) => freePort.listen(0, '127.0.0.1', resolve));
const port = freePort.address().port;
await new Promise((resolve) => freePort.close(resolve));
const base = `http://127.0.0.1:${port}`;
const env = {
  ...process.env,
  NEW_CMS_GRAPHQL_URL: cmsUrl,
  CMS_REVALIDATION_SECRET: secret,
  NEXT_TELEMETRY_DISABLED: '1',
};
function start(args) {
  const child = spawn(
    process.execPath,
    [path.join(root, 'node_modules/next/dist/bin/next'), ...args],
    { cwd: fixture, env, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  child.stdout.on('data', (chunk) => {
    logs += chunk;
  });
  child.stderr.on('data', (chunk) => {
    logs += chunk;
  });
  return child;
}
async function stop(child) {
  if (child && child.exitCode === null) {
    child.kill('SIGTERM');
    await once(child, 'exit');
  }
}
try {
  await mkdir(path.join(fixture, 'app/api/revalidate'), { recursive: true });
  await mkdir(path.join(fixture, 'app/tools/[slug]'), { recursive: true });
  await mkdir(path.join(fixture, 'app/list'), { recursive: true });
  await mkdir(path.join(fixture, 'app/legal'), { recursive: true });
  await mkdir(path.join(fixture, 'lib'), { recursive: true });
  await symlink(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
  await writeFile(
    path.join(fixture, 'package.json'),
    JSON.stringify({ name: 'cms-cache-integration', private: true, type: 'module' }),
  );
  await writeFile(
    path.join(fixture, 'app/layout.jsx'),
    `export const revalidate=0; export default function Layout({children}){return <html><body>{children}</body></html>}`,
  );
  await writeFile(
    path.join(fixture, 'app/page.jsx'),
    `export default function Page(){return <p>Cache integration</p>}`,
  );
  await build({
    entryPoints: ['src/content/sources/strapi/public-graphql.ts'],
    outfile: path.join(fixture, 'lib/reader.js'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    external: ['next/cache'],
  });
  await build({
    entryPoints: ['src/app/api/revalidate/route.ts'],
    outfile: path.join(fixture, 'app/api/revalidate/route.js'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    external: ['next/cache'],
  });
  await writeFile(
    path.join(fixture, 'app/tools/[slug]/page.jsx'),
    `
    import {notFound} from 'next/navigation';
    import {publicGraphql} from '../../../lib/reader';
    export default async function Page({params}){
      const {slug}=await params;
      const data=await publicGraphql('query PublishedTool($slug:String!){tools{slug title}}','PublishedTool',{slug});
      if(!data.tools.length) notFound(); return <p>{data.tools[0].title}</p>;
    }`,
  );
  await writeFile(
    path.join(fixture, 'app/list/route.js'),
    `
    import {publicGraphql} from '../../lib/reader';
    export async function GET(){return Response.json(await publicGraphql('query PublishedToolsMaster{toolMaster{tools{tool{slug title}}}}','PublishedToolsMaster'));}`,
  );
  await writeFile(
    path.join(fixture, 'app/legal/route.js'),
    `
    import {publicGraphql} from '../../lib/reader';
    export async function GET(){return Response.json(await publicGraphql('query PublishedPrivacyPolicy{privacyPolicy{title}}','PublishedPrivacyPolicy'));}`,
  );
  const builder = start(['build', '--webpack']);
  assert.equal((await once(builder, 'exit'))[0], 0, logs);
  server = start(['start', '-p', String(port), '-H', '127.0.0.1']);
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {
      /* Wait for startup. */
    }
    if (i === 99) throw new Error(logs);
    await delay(100);
  }
  const read = async (slug) => {
    const response = await fetch(`${base}/tools/${slug}`);
    return { status: response.status, html: await response.text() };
  };
  const event = async (name, slug, token = secret) => {
    const response = await fetch(`${base}/api/revalidate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Strapi-Event': name,
      },
      body: JSON.stringify({
        event: name,
        model: 'tool',
        uid: 'api::tool.tool',
        createdAt: new Date().toISOString(),
        entry: { documentId: 'test-document', slug },
      }),
    });
    await response.text();
    return response.status;
  };
  const probe = await fetch(`${base}/api/revalidate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}` },
    body: JSON.stringify({ event: 'trigger-test', createdAt: new Date().toISOString() }),
  });
  assert.equal(probe.status, 200);
  const probeReceipt = await probe.json();
  assert.equal(probeReceipt.test, true);
  assert.equal(probeReceipt.revalidated, false);
  assert.match((await read('old')).html, /initial/);
  await read('old');
  await Promise.all([read('old'), read('old'), read('old')]);
  assert.equal(counts.get('PublishedTool:old'), 1, 'warm route requests must not fetch CMS');
  await read('unrelated');
  await fetch(`${base}/legal`);
  assert.equal((await read('new')).status, 404);
  await fetch(`${base}/list`);
  await fetch(`${base}/list`);
  assert.equal(counts.get('PublishedToolsMaster:'), 1);
  records.delete('old');
  records.set('new', 'renamed');
  assert.equal(await event('entry.update', 'new', 'wrong-secret'), 401);
  assert.match((await read('old')).html, /initial/, 'unauthorized events cannot expire cache');
  assert.equal(await event('entry.update', 'new'), 200);
  assert.equal((await read('old')).status, 404);
  assert.match((await read('new')).html, /renamed/, 'cached 404 must be invalidated');
  const listing = await (await fetch(`${base}/list`)).json();
  assert.ok(listing.tools.some(({ slug }) => slug === 'new'));
  await read('unrelated');
  assert.equal(
    counts.get('PublishedTool:unrelated'),
    2,
    'native events expire the affected detail family for old slugs',
  );
  await fetch(`${base}/legal`);
  assert.equal(counts.get('PublishedPrivacyPolicy:'), 1, 'unrelated content types stay cached');
  assert.equal(counts.get('PublishedToolsMaster:'), 2, 'dependent listing refreshes once');
  records.delete('new');
  await event('entry.unpublish', 'new');
  assert.equal((await read('new')).status, 404);
  records.set('new', 'republished');
  await event('entry.publish', 'new');
  assert.match((await read('new')).html, /republished/);
  records.delete('new');
  await event('entry.delete', 'new');
  assert.equal((await read('new')).status, 404);
  assert.equal((await read('created')).status, 404);
  records.set('created', 'newly created');
  assert.equal(
    (await read('created')).status,
    404,
    'new records remain absent until their event expires the cached miss',
  );
  await event('entry.create', 'created');
  assert.match((await read('created')).html, /newly created/);
  await event('entry.create', 'created');
  assert.match((await read('created')).html, /newly created/);
  console.log(
    'PASS: production Next.js Data Cache, native Admin Trigger, warm request counts, scoped listing/detail expiration, cached 404, slug rename, all five events, duplicate events, authentication.',
  );
  console.log(JSON.stringify(Object.fromEntries(counts), null, 2));
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  await stop(server);
  await new Promise((resolve) => cms.close(resolve));
  await rm(fixture, { recursive: true, force: true });
}
