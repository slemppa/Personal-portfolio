import { blogPostMetadata, blogPostPage, blogPostParams } from '@/routes/pages'

export const generateStaticParams = blogPostParams('fi')
export const generateMetadata = blogPostMetadata('fi')
export default blogPostPage('fi')
