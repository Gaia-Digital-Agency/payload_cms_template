import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@/payload/payload.config'

// Payload's Next.js view layer expects `params` / `searchParams` as Promises in Next.js 15.
// Using `any` here avoids fighting Next's generated `PageProps` types.
export const generateMetadata = (args: any) =>
  generatePageMetadata({
    config: Promise.resolve(config as any),
    params: args.params,
    searchParams: args.searchParams,
  } as any)

export default async function Page(args: any) {
  return RootPage({
    config: Promise.resolve(config as any),
    importMap: {} as any,
    params: args.params,
    searchParams: args.searchParams,
  })
}
