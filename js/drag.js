const linkCategory = document.getElementById("linkCategory");
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const addBtn = document.getElementById('addBtn');
const addLinkPanel = document.getElementById('addLinkPanel');
const linkList = document.getElementById('linkList');
const addedCategories = document.getElementById('addedCategories');
const addLinkContainer = document.getElementById('addLinkContainer');

let editIndex = -1;
let linkCategories = [];

let links = [
    {
        title: "new link",
        url: "www.cnn.com",
        categories: ['node', 'js']
    },
    {
        title: "new link2",
        url: "www.cnn2.com",
        categories: ['node2', 'js2']
    }
];

document.addEventListener('DOMContentLoaded', () => {
    displayLinks();
    console.log("loaded dom");
})


function displayLinks() {
    linkList.innerHTML = '';
    let index = 0;
    const d = new Date();
    for (let link of links) {
        let linkHTMLString = `
            <div class="panel link" >
                <div class="link-options">
                    <button class="button-small" onclick="deleteLink(${index})">Delete</button>
                    <button class="button-small" onclick="editLink(${index})">Edit</button>
                </div>
                <h3 class="link-header">
                    <a href="${link.url}">${link.title} </a >
                </h3 >
                <p class="link-date">${d}</p>
                <div class="categories">Categories:`

        for (let category of link.categories) {
            linkHTMLString += `
                    <span class="category">${category}</span>`
        };
        linkHTMLString += "</div></div>";
        linkList.innerHTML += linkHTMLString;
        index++;
    }

}

addBtn.addEventListener('click', (event) => {
    showFormPanel();
})

cancelBtn.addEventListener('click', (event) => {
    event.preventDefault();
    linkTitle.value = '';
    linkURL.value = '';
    linkCategory.value = '';
    addedCategories.innerHTML = '';
    linkCategories = [];
    hideFormPanel();
})

linkCategory.addEventListener('keydown', function (event) {

    if (event.code === "Comma") {
        event.preventDefault();
        linkCategories.push(linkCategory.value)
        linkCategory.value = '';

        displayLinkCategories();
    }
})

function showFormPanel() {
    displayLinkCategories();
    addLinkContainer.classList.remove('hidden');
}
function hideFormPanel() {
    addLinkContainer.classList.add('hidden')
}
function displayLinkCategories() {

    addedCategories.innerText = "";
    for (let category of linkCategories) {
        let categoryHTMLString = `
        <span class="category">${category}</span>
        `;
        addedCategories.innerHTML += categoryHTMLString

    }
}

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const title = linkTitle.value;
    const url = linkURL.value;
    const categories = linkCategories;

    const newLink = {
        title,
        url,
        categories
    }

    if (editIndex === -1) {
        links.push(newLink);
    } else {
        links[editIndex] = newLink;
    }



    linkTitle.value = '';
    linkURL.value = '';
    linkCategory.value = '';
    addedCategories.innerHTML = '';
    linkCategories = [];

    displayLinks();
    hideFormPanel();

})

function deleteLink(index) {
    console.log("index", index);
    links.splice(index, 1);
    displayLinks();
}

function editLink(index) {
    console.log("index", index);
    editIndex = index;
    linkTitle.value = links[index].title;
    linkURL.value = links[index].url;
    linkCategories = links[index].categories;

    showFormPanel();
}