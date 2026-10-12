import { caseMetadata, casePage, caseParams } from '@/routes/pages'

export const generateStaticParams = caseParams('en')
export const generateMetadata = caseMetadata('en')
export default casePage('en')
