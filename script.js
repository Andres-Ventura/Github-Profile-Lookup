const APIURL = 'https://api.github.com/users/'
const form = document.getElementById('form')
const search = document.getElementById('search')

const main = document.getElementById('main')


async function getUser(username) {
    try {
        const { data } = await axios.get(APIURL + username)

        createUserCard(data)
        getRepos(username)
    }
    catch (err) {
        if (err.response.status == 404) {
           createErrorCard('No User Found') 
        }
        
    }
    

}

async function getRepos(username) {
    try {
        const { data } = await axios.get(APIURL + username + '/repos?sort=created')

        addReposToCard(data)
    }
    catch (err) {
        if (err.response.status == 404) {
           createErrorCard('Problem fetching repo') 
        }
        
    }
}

function createUserCard(user) {
    const cardHTML = `
    <div class="card">
        <div>
          <img
            src="${user.avatar_url}"
            height="200px"
            width="200px"
            alt="${user.name}"
            class="avatar"
          />
        </div>
        <div class="user-info">
          <h2>${user.name}</h2>
          <p>
            ${user.bio}
          </p>
          <ul>
            <li>${user.followers}<strong>Followers</strong></li>
            <li>${user.following}<strong>Following</strong></li>
            <li>${user.public_repos}<strong>Repos</strong></li>
          </ul>

          <div id="repos"></div>
        </div>
      </div>
    `

    main.innerHTML = cardHTML
}


function createErrorCard(message) {
    const cardHTML = `
    <div class="card">
    <h1>${message}</h1>
    </div>
    `
    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')
    repos
        .slice(0,5)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url

            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
    });
}
form.addEventListener('submit', (e) => {
    e.preventDefault() // prevents the form from trying to submit to a file that doesn't exist

    const user = search.value
    if (user) {
        getUser(user)
        search.value = ''
    }
})