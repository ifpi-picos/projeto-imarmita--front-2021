const LOCAL_API_URL = 'http://localhost:3000/api'
const REMOTE_API_URL = 'https://i-marmita.herokuapp.com/api'
const HOST = window.location.host
const API_URL = HOST.includes('netlify.app') ? REMOTE_API_URL : LOCAL_API_URL

const btnLogin = document.getElementById('btnLogin')
const btnSignUp = document.getElementById('btnSignUp')
const slctProfile = document.getElementById('profileType')
const formSignUp = document.getElementById('dDescription')

if (slctProfile) {
  slctProfile.onchange = () => {
    if (slctProfile.value == 1) {
      const labelDescription = document.createElement('label')
      labelDescription.setAttribute('for', 'description')
      labelDescription.classList.add('bioDescription')
      labelDescription.innerHTML = 'Descrição'

      const inputDescription = document.createElement('textarea')
      inputDescription.setAttribute('name', 'bioDescription')
      inputDescription.setAttribute('id', 'bioDescription')
      inputDescription.classList.add('bioDescription')

      formSignUp.appendChild(labelDescription)
      formSignUp.appendChild(inputDescription)
    } else {
      const labelDescription = document.getElementsByClassName('bioDescription')
      formSignUp.removeChild(labelDescription[1])
      formSignUp.removeChild(labelDescription[0])
    }
  }
}

if (btnLogin) {
  btnLogin.onclick = e => {
    e.preventDefault()
    const login = getDataFromFormLogin()
    sendDataToAPILogin(login)
  }
}

if (btnSignUp) {
  btnSignUp.onclick = async e => {
    e.preventDefault()
    const user = getDataFromFormSignup()

    secPassword = document.getElementById('confirm-password').value

    if (user.password === secPassword) {
      await sendDataToAPISignup(user)
    } else {
      window.alert('As senhas não correspondem.')
      window.location.reload(true)
    }
  }
}

function getDataFromFormLogin () {
  const login = {}
  login.email = document.getElementById('email').value
  login.password = document.getElementById('password').value
  return login
}

function getDataFromFormSignup () {
  const user = {}
  user.name = document.getElementById('name').value
  user.email = document.getElementById('email').value
  user.phone = document.getElementById('phone').value
  user.profileType = document.getElementById('profileType').value
  user.password = document.getElementById('password').value

  const descriptionExists = document.getElementById('bioDescription')
  if (descriptionExists) {
    user.bioDescription = descriptionExists.value
  }
  return user
}

function clearForm () {
  document.getElementById('password').value = ''
  const confPassword = document.getElementById('confirm-password')
  if (confPassword) {
    confPassword.value = ''
  }
}

async function sendDataToAPILogin (login) {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(login)
  })
  if (response.status === 200) {
    const data = await response.json()
    const { user } = data
    localStorage.setItem('username', JSON.stringify(user.name))
    window.location.href = '/views/userList.html'
  } else {
    const { message } = await response.json()
    alert(message)
    clearForm()
    document.getElementById('email').focus()
  }
}

async function sendDataToAPISignup (user) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(user)
  })

  if (response.status === 201) {
    window.alert('Efetue o login para começar.')
    window.location.href = '/views/login.html'
  } else {
    clearForm()
    const { message } = await response.json()
    alert(message)
    document.getElementById('name').focus()
  }
}
