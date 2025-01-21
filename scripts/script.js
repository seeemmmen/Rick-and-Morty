async function getData(index) {
    const url = `https://rickandmortyapi.com/api/character?page=${index}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }


        // const object = await JSON.parse(url);
        // console.log(object);
        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

function renderCharacters(characters) {
    const wrapper = document.querySelector(".wrapper");
    wrapper.innerHTML = "";
    characters.forEach(character => {
        const newDiv = document.createElement("div");
        const img = document.createElement("img");
        const p = document.createElement("p");

        p.innerHTML = character.species;
        img.setAttribute('src', character.image);
        newDiv.classList.add("characterBox");

        newDiv.textContent = character.name;
        newDiv.appendChild(p);
        newDiv.appendChild(img);
        wrapper.appendChild(newDiv);
    });
}

function renderPages(currentPage) {
    const totalPages = 42; 
    let paginationHTML = '<ul class="pagination">';
    
    if (currentPage > 1) {
        paginationHTML += `<li><a href="#" onclick="setWebsite(${currentPage - 1})">«</a></li>`;
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    

    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="active"><span>${i}</span></li>`;
        } else {
            paginationHTML += `<li><a href="#" onclick="setWebsite(${i})">${i}</a></li>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `<li><a href="#" onclick="setWebsite(${currentPage + 1})">»</a></li>`;
    }

    paginationHTML += '</ul>';
    document.getElementById('pagination').innerHTML = paginationHTML;
}

function setWebsite(page) {
    let currentPage = new URLSearchParams(window.location.search);
    currentPage.set("page", page);
    window.history.replaceState({}, '', `${window.location.pathname}?${currentPage}`);

    getData(page).then(
        (data) => {
            renderCharacters(data.results);
            renderPages(page); 
        },
        (reason) => {
            console.error(reason);
        }
    );
}

window.addEventListener("DOMContentLoaded", (event) => {
    let page = new URLSearchParams(window.location.search).get('page') || 1;
    page = parseInt(page);
    getData(page).then(
        (data) => {
            renderCharacters(data.results);
            renderPages(page);  
        },
        (reason) => {
            console.error(reason);
        }
    );
});