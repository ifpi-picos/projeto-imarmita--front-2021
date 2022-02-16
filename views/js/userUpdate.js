const LOCAL_API_URL = 'http://localhost:3000/api'
const REMOTE_API_URL = 'https://i-marmita.herokuapp.com/api'
const HOST = window.location.host
const API_URL = HOST.includes('netlify.app') ? REMOTE_API_URL : LOCAL_API_URL

const inputName = document.getElementById('name')
const inputEmail = document.getElementById('email')
const inputPhone = document.getElementById('phone')

const btnSaveUser = document.getElementById('btnSaveUser')

window.onload = async e => {
  const user = await getUserData()
  fillForm(user)
  localStorage.setItem('id', JSON.stringify(user.id))
}

function fillForm (user) {
  if (user.profileType === 1) {
    const lblBioDescription = document.createElement('label')
    lblBioDescription.setAttribute('for', 'description')
    lblBioDescription.classList.add('bioDescription')
    lblBioDescription.innerHTML = 'Descrição'

    const inputBioDescription = document.createElement('textarea')
    inputBioDescription.setAttribute('name', 'bioDescription')
    inputBioDescription.setAttribute('id', 'bioDescription')
    inputBioDescription.classList.add('bioDescription')

    const dDescription = document.getElementById('dDescription')
    dDescription.appendChild(lblBioDescription)
    dDescription.appendChild(inputBioDescription)

    inputBioDescription.value = user.bioDescription
  }
  inputName.value = user.name
  inputEmail.value = user.email
  inputPhone.value = user.phone
}

async function getUserData () {
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  if (response.status === 200) {
    const { user } = await response.json()
    return user
  } else {
    const { message } = await response.json()
    alert(message)
    window.location.href = '/views/login.html'
  }
}

function getDataFromUpdateForm () {
  const user = {}
  user.name = document.getElementById('name').value
  user.email = document.getElementById('email').value
  user.phone = document.getElementById('phone').value
  user.password = document.getElementById('password').value
  console.log(user.password)

  const descriptionExists = document.getElementById('bioDescription')
  if (descriptionExists) {
    user.bioDescription = descriptionExists.value
  }

  return user
}

async function sendDataToAPIUpdate (updatedUser, id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(updatedUser)
  })

  if (response.status === 200) {
    const { message } = await response.json()
    window.alert(message)
    window.location.href = '/views/userlist.html'
  } else {
    clearForm()
    const { message } = await response.json()
    alert(message)
    document.getElementById('name').focus()
  }
}

function clearForm () {
  document.getElementById('password').value = ''
  document.getElementById('confirm-password').value = ''
}

if (btnSaveUser) {
  btnSaveUser.onclick = async e => {
      e.preventDefault()
    const updatedUser = getDataFromUpdateForm()

    const secPassword = document.getElementById('confirm-password').value
    if (updatedUser.password === secPassword) {
      const id = localStorage.getItem('id')
      await sendDataToAPIUpdate(updatedUser, id)
    } else {
      window.alert('As senhas não correspondem.')
      window.location.reload(true)
    }
  }
}
