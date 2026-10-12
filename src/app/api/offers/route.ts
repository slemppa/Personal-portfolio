import handler from '@/server/handlers/offers'
import { toRouteHandler } from '@/server/nodeHandler'

const route = toRouteHandler(handler)

// Offer generation calls Claude and can take a while.
export const maxDuration = 60

export const GET = route
export const POST = route
export const OPTIONS = route
