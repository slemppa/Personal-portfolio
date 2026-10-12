import { caseMetadata, casePage, caseParams } from '@/routes/pages'

export const generateStaticParams = caseParams('fi')
export const generateMetadata = caseMetadata('fi')
export default casePage('fi')
