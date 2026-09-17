import type { TileDB } from '@/Shared/types/db-types/boards'
import type { TDepartureFragment } from '@/types/graphql-operations'
import React from 'react'

const DeparturesContext = React.createContext<TDepartureFragment[] | undefined>(undefined)

const TileContext = React.createContext<TileDB | undefined>(undefined)

export { DeparturesContext, TileContext }
