import request from 'superagent'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getGreeting(): Promise<string> {
  const res = await request.get(`${rootURL}/greeting`)
  return res.body.greeting
}

export interface Photo {
  id: string
  name: string
  path: string
  link: string
  preview: string
}

export interface Folder {
  id: string
  name: string
  path: string
}

export async function getPhotos(folderPath: string = ''): Promise<Photo[]> {
  const res = await request.get(`${rootURL}/photos`).query({ folder: folderPath })
  return res.body
}

export async function getFolders(parentPath: string = ''): Promise<Folder[]> {
  const res = await request.get(`${rootURL}/folders`).query({ parent: parentPath })
  return res.body
}

export async function getLocalPhotos(): Promise<Photo[]> {
  const res = await request.get(`${rootURL}/local-photos`)
  return res.body
}