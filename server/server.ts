import * as Path from 'node:path'
import * as fs from 'node:fs/promises'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import { getPhotosFromDropbox, getDropboxFolders } from './dropbox'

const server = express()

server.use(express.json())
server.use(cors('*' as CorsOptions))

// Serve static files from the shcaptured folder
server.use('/shcaptured', express.static(Path.resolve('./shcaptured')))

// API endpoint to get photos from a Dropbox folder
server.get('/api/v1/photos', async (req, res) => {
  try {
    const folderPath = req.query.folder ? String(req.query.folder) : ''
    const photos = await getPhotosFromDropbox(folderPath)
    res.json(photos)
  } catch (error) {
    console.error('Error in /api/v1/photos endpoint:', error)
    res.status(500).json({ error: 'Failed to fetch photos' })
  }
})

// API endpoint to get local photos from the shcaptured folder
server.get('/api/v1/local-photos', async (req, res) => {
  try {
    const shcapturedPath = Path.resolve('./shcaptured')
    const files = await fs.readdir(shcapturedPath)
    
    // Filter for image files only
    const photoFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    )
    
    // Map the files to a format similar to the Dropbox API response
    const photos = photoFiles.map((fileName, index) => ({
      id: `local-${index}`,
      name: fileName,
      path: `/shcaptured/${fileName}`,
      link: `/shcaptured/${fileName}`,
      preview: `/shcaptured/${fileName}`
    }))
    
    res.json(photos)
  } catch (error) {
    console.error('Error in /api/v1/local-photos endpoint:', error)
    res.status(500).json({ error: 'Failed to fetch local photos' })
  }
})

// API endpoint to get Dropbox folders
server.get('/api/v1/folders', async (req, res) => {
  try {
    const parentPath = req.query.parent ? String(req.query.parent) : ''
    const folders = await getDropboxFolders(parentPath)
    res.json(folders)
  } catch (error) {
    console.error('Error in /api/v1/folders endpoint:', error)
    res.status(500).json({ error: 'Failed to fetch folders' })
  }
})

server.get('/api/v1/greeting', (req, res) => {
  const greetings = ['hola', 'hi', 'hello', 'howdy']
  const index = Math.floor(Math.random() * greetings.length)
  console.log(index)
  res.json({ greeting: greetings[index] })
})

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
