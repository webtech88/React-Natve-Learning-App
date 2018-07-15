import { create } from 'apisauce'
import Config from 'react-native-config'
import sha1 from 'sha1'

const Buffer = global.Buffer || require('buffer').Buffer

let btoa
if (typeof btoa === 'undefined') {
	btoa = str => new Buffer(str).toString('base64')
}

const cloudinaryAuth = btoa(`${Config.CLOUDINARY_KEY}:${Config.CLOUDINARY_SECRET}`)
const api = create({
	baseURL: `https://api.cloudinary.com/v1_1/${Config.CLOUDINARY_CLOUD_NAME}/`,
	timeout: 2000,
	headers: {
		Authorization: `Basic ${cloudinaryAuth}`,
	},
})

/**
 * Sorts through an array of objects based on parsed key values
 * @param  {array} array  [array containing the objects]
 * @param  {string} key   [string defining the key of the values to sort by]
 * @param  {string} order ['asc' for ascending, 'desc' for descending]
 * @return {array}        [array with sorted objects]
 */
export const sortObjects = (array, key, order) => {
	if (typeof order === 'undefined') {
		console.warn('No \'order\' argument parsed to sortObjects, defaulting to \'ascending\'.')
	} else if (order !== 'asc' && order !== 'desc') {
		throw ('Incorrect object sort order argument supplied')
	}

	return array.sort((a, b) => {
		if (a[key] < b[key]) {
			return order === 'asc' ? -1 : 1
		}

		if (a[key] > b[key]) {
			return order === 'asc' ? 1 : -1
		}

		return 0
	})
}

export const shuffle = (array) => {
	let currentIndex = array.length
	let temporaryValue
	let randomIndex

	// While there remain elements to shuffle...
	while (currentIndex !== 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex -= 1

		// And swap it with the current element.
		temporaryValue = array[currentIndex]
		array[currentIndex] = array[randomIndex]
		array[randomIndex] = temporaryValue
	}

	return array
}

/**
 * Searches for the specified string <str> in an Array of Object
 * Example given an array of objects
 * myArray = [{name:'john', gender:'man', title: 'engineer'}, {name:'jane', gender:'woman', title: 'manager'}]
 * To search for 'ne' in the title and the name fields should return both results as
 * search('ne', myArray, ['name', 'title'])
 * Similarly searching just against the title will return one object as [{name:'john', gender:'man', title: 'engineer'}]
 */

export const search = (str, array, fieldsArray) => {
	const resultsArray = []

	for (const item of array) {
		for (const field of fieldsArray) {
			if (item[field].toUpperCase().indexOf(str.toUpperCase()) >= 0) {
				resultsArray.push(item)
				// break loop
			}
		}
	}

	return resultsArray
}

export const convertToFormData = (data) => {
	const form = new FormData()
	Object.keys(data).forEach(key => form.append(key, data[key]))

	return form
}

// format time to hh:mm:ss or m:ss if less than hour
export const formatTime = (seconds) => {
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = Math.floor(seconds % 60)
	return [
		h,
		m > 9 ? m : (h ? '0' : '') + m, // NOTE don't show 00 for minutes if time less that an hour
		s > 9 ? s : `0${s}`,
	].filter(ss => ss).join(':')
}

export const getCloudinaryFileMetadata = (publicId, mediaType = 'image') => new Promise((callback, reject) => {
	api.get(`resources/${mediaType}/upload/${publicId}`).then((response) => {
		if (response.ok && response.data) {
			callback(response.data)
		} else if (response.problem) {
			reject(response)
		}
	}).catch(err => reject(err))
})

export const deleteCloudinaryFile = (publicId: string, type = 'image') => new Promise((callback, reject) => {
	const timestamp = Date.now()
	const keys = `public_id=${publicId}&timestamp=${timestamp}${Config.CLOUDINARY_SECRET}`
	const signature = sha1(keys)
	api.post(`${type}/destroy`,
		{ public_id: publicId, timestamp, api_key: Config.CLOUDINARY_KEY, signature })
		.then((response) => {
			if (response.ok && response.data && response.data.result) {
				callback(response.data.result)
			} else if (response.problem) {
				reject(response.problem)
			}
		})
})

export const getVimeoIframe = (url: string, height: number, width: number): Promise =>
	new Promise((callback, reject) => {
		const vimeoApi = create({
			baseURL: 'https://vimeo.com/api/oembed.json',
			timeout: 2000,
		})
		const encodedUri: string = encodeURI(url)

		vimeoApi.get('', { url: encodedUri, height, width }).then((response) => {
			if (response.ok && response.data) {
				callback(response.data)
			}
			reject()
		})
	})
