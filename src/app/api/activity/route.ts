import handler from '@/server/handlers/activity'
import { toRouteHandler } from '@/server/nodeHandler'

const route = toRouteHandler(handler)

export const GET = route
export const POST = route
export const OPTIONS = route
