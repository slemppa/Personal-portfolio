import { blogPostMetadata, blogPostPage, blogPostParams } from '@/routes/pages'

export const generateStaticParams = blogPostParams('en')
export const generateMetadata = blogPostMetadata('en')
export default blogPostPage('en')
