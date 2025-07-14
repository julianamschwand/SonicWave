import api from "./api.js"

export default async function request(method, url, data = null) {
  try {
    const response = await api({
      method,
      url,
      ...data,
    })

    return response.data
  } catch (error) {
    if (!error.response) {
      console.error('Network / CORS error:', error)
    }

    const { status, data: errorData } = error.response
    console.error(`API Error [${status}]`, errorData)

    return errorData
  }
}