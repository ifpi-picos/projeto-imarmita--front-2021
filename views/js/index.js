
const logout = document.getElementById('btnSignOutLnk')

function getUser() {
    return localStorage.getItem('username')
}

function cleanUser() {
    localStorage.removeItem('username')
    document.cookie = "token=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=; path=/";
}

logout.onclick = () => {
    if(getUser()) {
        cleanUser()
    }
    window.location.href = '/views/login.html'
}