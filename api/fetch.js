

import auth from '../api/auth'
const errorHandler = (error) => {
  let message
  if(error.status === 401) {
    message = error.data.message
    localStorage.setItem('auth', JSON.stringify({access_token: '',isAuthenticated: false, routes: [], user: {}}))
    navigateTo('/dashboard') //this will navigate to /, not sure why it does go back to / after error.
  }
  if(error.status === 500)  message = error.data.message
  if(error.status === 403)  message = error.data.message
  if(error.status === undefined)  message = "Something went wrong from the request."
  
  else return message = error.data.message
  return message
}

const get = async (url, queries = {}) => {
  let queryString = ''
  if(queries) queryString = Object.entries(queries).map(query => `${query[0]}=${query[1]}`).join('&')
    let data
    let error_response = ''
  try {
    data = await $fetch(`${url}?${queryString}`,{ 
      headers: {
        'Authorization' : `Bearer ${auth.get().access_token}`
      }
     })
  } catch (error) {
    error_response = errorHandler(error)
  }
  return {
    data,
    error_response,
  }
}

const post = async (url, body) => {
  let response
  let error_response 
  try {
    const res = await $fetch(`${url}`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization' : `Bearer ${auth.get().access_token}`
      },
      body
      // body: JSON.stringify(body)
    })
    response = res.message
  } catch (error) {
    error_response = errorHandler(error)
  }
  return {
    response,
    error_response
  }
}

const patch = async (url, body) => {
  let response
  let error_response 
  try {
    const res = await $fetch(`${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${auth.get().access_token}`
      },
      body: JSON.stringify(body)
    })
    response = res.message
  } catch (error) {
    error_response = errorHandler(error)
  }
  return {
    response,
    error_response
  }
}

export default {
  get,
  post,
  patch
}