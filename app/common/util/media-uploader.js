import sha1 from 'sha1'
import RNFetchBlob from 'react-native-fetch-blob'
import Config from 'react-native-config'

import ENDPOINT from '../../core/config/endpoint'

class MediaUploader {

	uploaderResponseHandler = (response, callback, reject) => {
		const parsedResponse = JSON.parse(response.data)
		if (parsedResponse.error) {
			reject(parsedResponse.error)
		}
		return callback({
			cloudId: parsedResponse.public_id,
		})
	}

	upload = (uri: string, memberId: number) => new Promise((callback, reject) => {
		if (!uri) {
			Promise.reject(new Error('Wrong file'))
		}
		RNFetchBlob.fs.exists(uri)
			.then((exist) => {
				if (exist) {
					const folder = Config.CLOUDINARY_UPLOAD_FOLDER
					const tags = `member:${memberId}`
					const timestamp = Date.now()
					const keys = `folder=${folder}&tags=${tags}&timestamp=${timestamp}${Config.CLOUDINARY_SECRET}`
					const signature = sha1(keys)
					return RNFetchBlob.fetch('POST', `${ENDPOINT.CLOUDINARY_URL}/${Config.CLOUDINARY_CLOUD_NAME}/auto/upload`, {
						'Content-Type': 'multipart/form-data',
					}, [
						{ name: 'file', filename: uri, data: RNFetchBlob.wrap(uri) },
						{ name: 'api_key', data: Config.CLOUDINARY_KEY },
						{ name: 'timestamp', data: String(timestamp) },
						{ name: 'signature', data: String(signature) },
						{ name: 'folder', data: folder },
						{ name: 'tags', data: tags },
					]).then(response => this.uploaderResponseHandler(response, callback, reject))
						.catch(err => reject(err))
				}
			})
			.catch(err => reject(err))
	})


}


export default new MediaUploader()
