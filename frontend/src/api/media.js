import { http } from './http'

export async function uploadMedia(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await http.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
