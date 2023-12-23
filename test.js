const input = document.querySelector(".user-input");
const inputContainer = document.querySelector(".input-container");
const reposList = document.querySelector(".repos-wrapper");
let counter = 0;

input.addEventListener("keyup", debounce(getRepos, 400));
inputContainer.addEventListener("click", addRepo);
reposList.addEventListener("click", deleteRepo);

//Дебаунс функция
function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

//Получаем репозитории и вызываем их показ
function getRepos(evt) {
    const { value } = evt.target;
    value.trim();
    if (value === "") {
        return;
    }

    fetch(`https://api.github.com/search/repositories?q=${value}`)
        .then((responce) => responce.json())
        .then((result) => {
            renderPopup(result.items);
        })
        .catch(() => alert("Ошибка обработки запроса!"));
}

//Показываем репозитории
function renderPopup(reposArr) {
    if (reposArr.length >= 1) {
        const popContainer = document.createElement("ul");
        popContainer.classList.add("popup-wrapper");
        inputContainer.append(popContainer);

        for (let i = 0; i < 5 && i < reposArr.length; i++) {
            const pop = document.createElement("button");
            pop.classList.add("popup");
            pop.textContent = `📁 ${reposArr[i].name} | 👤 ${reposArr[i].owner.login} | ⭐ ${reposArr[i].stargazers_count}`;
            popContainer.append(pop);
        }

        input.addEventListener("keyup", () => {
            popContainer.remove();
        });
    } else {
        alert("Репозиторий не найден!");
        input.value = "";
    }
}

//Добавляем репозиторий в сохраненные и удаляем автокомплит
function addRepo(evt) {
    if (evt.target.className !== "popup") {
        return;
    }
    document.body.querySelector(".popup-wrapper").remove();

    let popPartsArr = evt.target.textContent.split("|");
    popPartsArr[0] = `<p>Repo: ${popPartsArr[0].slice(2)}</p>`;
    popPartsArr[1] = `<p>User: ${popPartsArr[1].slice(3)}</p>`;
    popPartsArr[2] = `<p>Stars: ${popPartsArr[2].slice(2)}</p>`;
    const reposListItem = popPartsArr.join("");

    if (counter < 5) {
        const newRepo = document.createElement("li");
        newRepo.classList.add("repo");
        reposList.append(newRepo);

        const divInsideRepo = document.createElement("div");
        divInsideRepo.classList.add("card-wrapper");
        newRepo.append(divInsideRepo);

        const newDiv = document.createElement("div");
        newDiv.classList.add("li-info");
        divInsideRepo.append(newDiv);

        const newBtnWrapper = document.createElement("div");
        newBtnWrapper.classList.add("btn-wrapper");
        divInsideRepo.append(newBtnWrapper);

        const newRemoveBtn = document.createElement("button");
        newRemoveBtn.classList.add("delete-button");
        newRemoveBtn.textContent = "X";
        newBtnWrapper.append(newRemoveBtn);

        newDiv.insertAdjacentHTML("beforeend", `${reposListItem}`);
        counter++;
    } else {
        alert("Достигнут максимум репозиториев!");
    }
    input.value = "";
}

//Удаляем репозиторий
function deleteRepo(evt) {
    if (evt.target.className != "delete-button") return;
    let repo = evt.target.closest(".repo");
    repo.remove();
    counter--;
}