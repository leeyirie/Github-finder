

const userSection = document.querySelector('.user-section');
const searchInput = document.querySelector('.search-input');
const reposSection = document.querySelector('.repos-section');



//클래스를 각각의 인스턴스를 생성함.
class User {
    constructor(username) {
        this.name = username;
        this.profileUrl = `https://api.github.com/users/${username}`;
        this.reposUrl =  `https://api.github.com/users/${username}/repos`;
        this.followersUrl = `https://api.github.com/users/${username}/followers`;
        this.followingUrl = `https://api.github.com/users/${username}/following`;
        this.gistsUrl = `https://api.github.com/users/${username}/gists`;
        this.starredUrl = `https://api.github.com/users/${username}/starred`;
        
        this.profile = {}; // 사용자 프로필 정보
        this.repos = []; // 사용자의 레포지토리 목록
        this.followers = []; // 팔로워 목록
        this.following = []; // 팔로잉 목록
        this.gists = []; // 기스트 목록
        this.starred = []; // 스타 받은 레포지토리 목록
    }



// GitHub API로부터 사용자 데이터(프로필, 팔로워, 레포지토리 등)을 가져온다.
    async fetchUserData() {
        try {
            const response = await fetch(this.profileUrl);
            if (!response.ok) {
                throw new Error('User profile not found');
            }
            this.profile = await response.json();
        } catch (err) {
          console.error('Error fetching user data', err); }
    }




    async fetchUserRepos() {
        try {
            const response = await fetch(this.reposUrl);
            if (!response.ok) {
                throw new Error('User repos not found');
            }
            this.repos = await response.json();
        } catch (err) {
          console.error('Error fetching user repos', err); }
    }

    async fetchUserFollowers() {
        try {
            const response = await fetch(this.followersUrl);
            if (!response.ok) {
                throw new Error('User followers not found');
            }
            this.followers = await response.json();
        } catch (err) {
          console.error('Error fetching user followers', err); }
    }

    async fetchUserFollowing() {
        try {
            const response = await fetch(this.followingUrl);
            if (!response.ok) {
                throw new Error('User following not found');
            }
            this.following = await response.json();
        } catch (err) {
          console.error('Error fetching user following', err); }
    }

    async fetchUserGists() {
        try {
            const response = await fetch(this.gistsUrl);
            if (!response.ok) {
                throw new Error('User gists not found');
            }
            this.gists = await response.json();
        } catch (err) {
          console.error('Error fetching user gists', err); }
    }

    async fetchUserStarred() {
        try {
            const response = await fetch(this.starredUrl);
            if (!response.ok) {
                throw new Error('User starred not found');
            }
            this.starred = await response.json();
        } catch (err) {
            console.error('Error fetching user starred', err);
        }
    }
}




//인풋값을 넣었을때 정보가 나오도록 이벤트 리스너를 만들어줌. 
searchInput.addEventListener('keyup', async (e) => {
     if (e.key === 'Enter') {
        const userName = searchInput.value.trim();
        if(userName) {
            const user = new User(userName);
            await user.fetchUserData();
            displayUserInfo(user.profile);
            await user.fetchUserRepos();
            displayUserRepos(user.repos);
        }
     }
    });



function displayUserInfo(user) {
    userSection.innerHTML = `
    <div class="user-info">
        <img class="user-avatar" src="${user.avatar_url}" alt="avatar">
        <div class="user-details">
         <h1 class="user-name">${user.name}</h1>
         <ul>
            <li class="user-detail">Followers: ${user.followers}</li>
            <li class="user-detail">Following: ${user.following}</li>
            <li class="user-detail">Gists: ${user.public_gists}</li>
            <li class="user-detail">Repos: ${user.public_repos}</li>
         </ul>
        <button class="github-link">
            <a href="${user.html_url}" target="_blank">View Profile on GitHub</a>
        </button>
        </div>
    </div>
    `;
}


function displayUserRepos(repos) {
    const reposList = document.createElement('div');
    reposList.classList.add('repos-list');
    
    repos.forEach((repo,i) => {
        const repoItem = document.createElement('div');
        repoItem.classList.add('repo-item');
        
        repoItem.innerHTML = `
        <p>Repository ${i+1} </p>
           <div class="repos">
           <a href='${repo.html_url}' target='_blank' class="repo-name">${repo.name}</a>
            <div class="repo-details">
                <span class="stars">Stars: ${repo.stargazers_count}</span>
                <span class="watchers">Watchers: ${repo.watchers_count}</span>
                <span class="forks">Forks: ${repo.forks_count}</span>
            </div>
           </div>
            `;
        reposList.appendChild(repoItem);
    });
    
    const previousReposList = reposSection.querySelector('.repos-list');
    if (previousReposList) {
        reposSection.removeChild(previousReposList);
    }
    
    reposSection.appendChild(reposList);
}