import { createSelector } from 'reselect'

export const getConnections = createSelector(
	state => state.data,
	data => data && data.filter(element => element.status !== 'unrelated'),
)

export const getConnectionsOnline = createSelector(
	getConnections,
	data => data && data.filter(element => element.online === 1),
)
