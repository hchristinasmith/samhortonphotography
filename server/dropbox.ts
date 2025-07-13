import { Dropbox } from 'dropbox'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Dropbox client
const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
})

// Function to list files in a specific Dropbox folder
export async function getPhotosFromDropbox(folderPath: string = '') {
  try {
    const response = await dbx.filesListFolder({
      path: folderPath,
      include_media_info: true,
    })

    // Filter for image files only
    const photos = response.result.entries.filter((entry) => {
      return (
        entry['.tag'] === 'file' &&
        /\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)
      )
    })

    // Get temporary links for each photo
    const photosWithLinks = await Promise.all(
      photos.map(async (photo) => {
        try {
          const linkResponse = await dbx.filesGetTemporaryLink({
            path: photo.path_lower as string,
          })
          return {
            id: photo.id,
            name: photo.name,
            path: photo.path_lower,
            link: linkResponse.result.link,
            preview: linkResponse.result.metadata.preview_url,
          }
        } catch (error) {
          console.error(`Error getting link for ${photo.name}:`, error)
          return {
            id: photo.id,
            name: photo.name,
            path: photo.path_lower,
            link: null,
            preview: null,
          }
        }
      })
    )

    return photosWithLinks
  } catch (error) {
    console.error('Error fetching photos from Dropbox:', error)
    throw error
  }
}

// Function to get folders in Dropbox
export async function getDropboxFolders(parentPath: string = '') {
  try {
    const response = await dbx.filesListFolder({
      path: parentPath,
    })

    // Filter for folders only
    const folders = response.result.entries.filter(
      (entry) => entry['.tag'] === 'folder'
    )

    return folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      path: folder.path_lower,
    }))
  } catch (error) {
    console.error('Error fetching folders from Dropbox:', error)
    throw error
  }
}
