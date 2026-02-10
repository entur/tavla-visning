import type { BoardTileDB } from '@/Shared/types/db-types/boards'
import type { TDepartureFragment } from '@/types/graphql-schema'
import React from 'react'

const DeparturesContext = React.createContext<TDepartureFragment[] | undefined>(undefined)

const TileContext = React.createContext<BoardTileDB | undefined>(undefined)

export { DeparturesContext, TileContext }
