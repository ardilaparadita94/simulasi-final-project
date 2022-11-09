const url = 'https://6352da05d0bca53a8eb68303.mockapi.io/users'
const elForm = document.getElementById('form-regist')
elForm.addEventListener('submit', function (event) {
  event.preventDefault()
  const formData = new FormData(elForm)
  const values = Object.fromEntries(formData)
  // console.log(values)
  const { username, email, password } = values
  if (!username) {
    alert(`Username can't be empty !`)
  } else if (!email) {
    alert(`Email can't be empty !`)
  } else if (!password) {
    alert(`Password can't be empty !`)
  } else {
    const userLogin = {
      username,
      email,
      password
    }
    // const userLoginStr = JSON.stringify(userLogin)
    // localStorage.setItem('user', userLoginStr)
    // onGreeting(username)
    getDataUser()
      .then(data => {
        // console.log(data)
        if (data) {
          const findUser = data.find(element => element.username === username || element.email === email)
          // console.log(findUser, '<<< find user')
          if (findUser) {
            // jika sudah pernah register
            throw new Error('Username / email is exist !')  
            // membuat error yang automatis, akan masuk ke catch
          } else {
            // jika belum pernah register
            return savedDataUser(userLogin)
          }
        } else {
          // jika data dari API belum ada
          return savedDataUser(userLogin)
        }
      })
      .then(value => {
        // ketika berhasil di saved data ke API
        const dataUserString = JSON.stringify(value)
        localStorage.setItem('user', dataUserString)
        onGreeting(username)
      })
      .catch(error => {
        const message = error.message || 'Failed create user'
        // console.log(error, '<<< error')
        alert(message)
      })
  }
})

function getDataUser () {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(value => {
        // console.log(value)
        resolve(value)
      })
      .catch(error => {
        // console.log(error)
        reject(error)
      })
  })
}

function savedDataUser (data = {}) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(value => {
        // console.log(value)
        resolve(value)
      })
      .catch(error => {
        // console.log(error)
        reject(error)
      })
  })
}

function onGreeting (username = '') {
 const eltextContainerAfterLogin = document.getElementById('text-container-after-login')
  const elGreeting = document.getElementById('greeting')
  
  if (username) {
    eltextContainerAfterLogin.classList.add('d-block')
    elGreeting.innerHTML = 'Hello ' + username + ',' + 'Selamat Datang Di LOYS' 

    

    elForm.classList.add('d-none')
  } else {
    elGreeting.innerHTML = ''
    eltextContainerAfterLogin.classList.remove('d-block')
    elForm.classList.remove('d-none')
  }
}

function login () {
  localStorage.removeItem('user')
  onGreeting()
}

function checkUserLogin () {
  const getUser = localStorage.getItem('user')
  if (getUser) {
    // jika sudah ada yang login
    const userLogin = JSON.parse(getUser)
    // console.log(userLogin)
    const username = userLogin.username
    onGreeting(username)
  }
}

checkUserLogin()