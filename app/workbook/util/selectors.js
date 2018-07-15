import { createSelector } from 'reselect'

export const getActiveQualification = createSelector(
	state => state.data,
	state => state.activeQualificationId,
	(data, activeQualificationId) => data && activeQualificationId && data[activeQualificationId],
)

