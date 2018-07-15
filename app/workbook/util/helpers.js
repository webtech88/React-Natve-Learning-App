import moment from 'moment-timezone'
import getVideoId from 'get-video-id'

import { getCloudinaryFileMetadata } from '../../common/util/helpers'

export const getVideoData = (videoUrl: string): Promise => new Promise((callback, reject) => {
	const video = getVideoId(videoUrl)

	if (video) {
		callback({ ...video, url: videoUrl })
	} else {
		getCloudinaryFileMetadata(videoUrl, 'video')
			.then(() => callback({ id: videoUrl, service: 'cloudinary', url: videoUrl }))
			.catch(err => reject(err))
	}
})

const exctractChapterTitle: string = (element: Object) => element.reduce((acc, cur) => {
	if (cur && typeof cur === 'string') { // if it's a string just add it
		return acc + cur
	} else if (cur && cur.props && cur.props.children) { // if element contains children
		return acc + exctractChapterTitle(cur.props.children)
	} else if (cur && Array.isArray(cur)) { // if it's an array pass it directly to this function
		return acc + exctractChapterTitle(cur)
	}
	return acc
}, '')

export const getChapterTitles: Array<string> = (chapters: Array<any>) => chapters.map((chapter) => {
	if (chapter[0]) {
		return exctractChapterTitle(chapter[0])
	}
	return ''
})

export const expectedGraduation = (start, hours) => {
	const days = Math.ceil(hours / 6) - moment().diff(start, 'days')
	if (days < 0) {
		return `${Math.abs(days)} days ago`
	}
	return `in ${days} days`
}
