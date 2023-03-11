import { json } from 'express'

export const bodyParser: ReturnType<typeof json> = json()
