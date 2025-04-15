const searchForm = document.getElementById('search_form');
const searchLogin = document.getElementById('search-login');
const searchBtn = document.getElementById('search_btn');
const searchRes = document.getElementById('search-res');
const historyList = document.getElementById('historyList');

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    user = searchLogin.value.trim();
    if (user) {
        GetDataUser(user)
    }
})

async function GetDataUser(user) {
    try {
        const response = await fetch(`https://api.github.com/users/${user}`)
        const reData = await response.json()
        console.log(reData)
        getUserOutData(reData)
        saveUserDataToLocalStorage(reData)
    } catch (e) {
        displayEror(e)
    }
}

function getUserOutData(user) {
    searchRes.innerHTML = ""
    if (user.login == undefined) {
        searchRes.innerHTML = 'Пользователь не найден';
        searchRes.classList.add('error-user')
        return
    }
    const profileCard = document.createElement('div')
    profileCard.className = 'profile-card'
    searchRes.append(profileCard)
    const pUser = document.createElement('p')
    pUser.className = 'pUser'
    const userAvatar = document.createElement(`img`)
    const rigthBlock = document.createElement('div')
    rigthBlock.className = 'user__info-block'
    rigthBlock.append(pUser)
    // user avatar
    userAvatar.src = user.avatar_url ?? 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
    userAvatar.alt = `Аватар пользователя: ${user.login}`
    // username
    userLogin = user.login ?? 'Не найдено'
    // userId
    userId = user.id ?? 'Не найдено'
    // userNode_id
    userNode_id = user.node_id ?? 'Не найдено'
    // userBio
    userBio = user.bio ?? 'Не найдено'
    // append to card
    profileCard.append(userAvatar)
    pUser.innerHTML = `user login: ${userLogin} </br> user id: ${userId} </br> node id: ${userNode_id} </br> user bio: ${userBio} </br> user url: <a href='${user.html_url}' target='_blank'>${user.html_url}</a>`
    profileCard.append(pUser)
    userAvatar.className = 'AvatarImg'
    // userAvatar.src = `${user.avatar_url}`
    // profileCard.append(userAvatar)
    // pUser.innerHTML = `user login: ${user.login} user id: ${user.id} node id: ${user.node_id}`
    // profileCard.append(pUser)
}

function displayEror(e) {
    searchRes.textContent = e;
    searchRes.classList.add('error')
}

function saveUserDataToLocalStorage(user) {
    if (!user.login) return

    let history = JSON.parse(localStorage.getItem('history')) ?? []

    console.log(history)

    history = history.filter(Item => Item.id !== user.id)

    history.unshift(user)

    if (history.legth > 10) {
        history = history.slice(0, 10)
    }

    localStorage.setItem('history', JSON.stringify(history))
}

function localHistory() {
    let history = JSON.parse(localStorage.getItem('history')) ?? []

    if (history.legth === 0) {
        historyList.innerHTML = `<div class='empty-text'>The History is empty</div>`
        return
    }
    console.log(history)

    history.forEach(el => {
        console.log(el)
        const historyItem = document.createElement('li')
        historyItem.className = 'historyItem'
        historyItem.innerHTML = `
        <img src='${el.avatar_url}' alt='User's avatar in the history' style='height: 100px; border-radius: 100%;'>
        <span>${el.login ?? 'undefind'}</span>
        `
        historyItem.addEventListener('click', () => {
            GetDataUser(el.login)
        })
        historyList.append(historyItem)
    });

}

window.addEventListener('load', localHistory)
