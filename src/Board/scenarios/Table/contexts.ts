import React from 'react'
import type { TileDB } from '@/Shared/types/db-types/boards'
import type { TDepartureFragment } from '@/types/graphql-operations'

const DeparturesContext = React.createContext<TDepartureFragment[] | undefined>(undefined)

const HasFetchErrorContext = React.createContext<boolean>(false)

const TileContext = React.createContext<TileDB | undefined>(undefined)

export { DeparturesContext, HasFetchErrorContext, TileContext }
