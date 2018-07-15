import { createSelector } from 'reselect'

export const getCurrentQualification = createSelector(
	state => state.data,
	state => state.currentQualificationId,
	(data, currentQualificationId) => data && data[currentQualificationId],
)
