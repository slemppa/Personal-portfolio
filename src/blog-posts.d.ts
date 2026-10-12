// Provided at build time by scripts/cmsPosts.ts (posts fetched from Payload CMS).
declare module 'virtual:blog-posts' {
  const posts: import('./lib/parsePost').Post[]
  export default posts
}
