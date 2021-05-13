
// main components
const file_input = document.querySelector('#file-input');
const homeContents = document.querySelector('.home-contents');
const contents = document.querySelector('.contents');
const convertSettings = document.querySelector('.convert-settings');

// contents components
const addButton = contents.querySelector('.icon-bar').firstElementChild;
const sortButton = contents.querySelector('.icon-bar').children[1];

// convertSettings components
const orientingBoxes = convertSettings.querySelector('.box-container').querySelectorAll('.orientation-box');
let currentOrientation = 'card-vertical';
const fieldBoxes = convertSettings.querySelectorAll('.box-container')[1].querySelectorAll('.orientation-box');
let currentField = 'standard-field';
const convertButton = convertSettings.querySelector('.button');


const global_files = [];


file_input.addEventListener('change', (event) => {
    const images = event.target.files;

    // to-do validation
    createCards(images, currentOrientation, currentField);
    updateDocument();
    resetCounter(images.length);

    addFiles(file_input.files)
});


homeContents.ondragenter = (event) => {
    dropAreaBehavior(homeContents);
}

contents.ondragenter = (event) => {
    if (event.dataTransfer.types.indexOf('card')) {
        dropAreaBehavior(contents);
    }
}

addButton.addEventListener('click', (event) => {
    const clickEvent = new MouseEvent('click');
    file_input.dispatchEvent(clickEvent);
});

sortButton.addEventListener('click', (event) => {
    const cards = document.querySelectorAll('.card-container');
    const cardsArray = Array.prototype.slice.call(cards, 0);

    //ASCii
    const cardsSortAscending = (a, b) => {
        if (a.textContent.toLowerCase() < b.textContent.toLowerCase()) {
            return -1;
        }
        if (a.textContent.toLowerCase() > b.textContent.toLowerCase()) {
            return 1;
        }

        return 0;
    };

    const cardsSortDescending = (a, b) => {
        if (a.textContent.toLowerCase() < b.textContent.toLowerCase()) {
            return 1;
        }
        if (a.textContent.toLowerCase() > b.textContent.toLowerCase()) {
            return -1;
        }

        return 0;
    };

    if (event.target.hasAttribute('data-sorted')) {
        cardsArray.sort(cardsSortDescending);
        event.target.removeAttribute('data-sorted');

        event.target.classList.remove('sort-descending');
        event.target.classList.add('sort-ascending');

    }
    else {
        cardsArray.sort(cardsSortAscending);
        event.target.setAttribute('data-sorted', null);

        event.target.classList.remove('sort-ascending');
        event.target.classList.add('sort-descending');
    }

    cards.forEach((card) => contents.removeChild(card));
    cardsArray.forEach((card) => contents.append(card));
});

orientingBoxes.forEach((box) => {
    box.addEventListener('click', (event) => {
        activatingBox(box, orientingBoxes);
    });
});

fieldBoxes.forEach((box) => {
    box.addEventListener('click', (event) => {
        activatingBox(box, fieldBoxes);
    });
});

function activatingBox(box, boxes) {
    let activeBox = null;
    for (let node of boxes.values()) {
        if (node.classList.contains('active')) {
            activeBox = node;
            break;
        }
    }

    if (activeBox == box) { return; }

    activeBox.classList.remove('active');
    activeBox.classList.add('not-active');

    box.classList.remove('not-active');
    box.classList.add('active');

    changeOrientation(box);
    changeFieldBox(box);
}

function changeOrientation(box) {
    if (!box.hasAttribute('data-orientation')) { return; }

    const cards = document.querySelectorAll('.card-container');

    if (box.getAttribute('data-orientation') === 'vertical') {
        for (let card of cards.values()) {
            const alignment = card.firstElementChild;
            alignment.classList.remove('card-horizontal');
            alignment.classList.add('card-vertical');
        }

        currentOrientation = 'card-vertical';
    }
    else {
        for (let card of cards.values()) {
            const alignment = card.firstElementChild;
            alignment.classList.remove('card-vertical');
            alignment.classList.add('card-horizontal');
        }

        currentOrientation = 'card-horizontal';
    }
}

function changeFieldBox(box) {
    if (!box.hasAttribute('data-type-field')) { return; }

    const cards = document.querySelectorAll('.card-container');
    if (box.getAttribute('data-type-field') === 'standart') {
        for (let card of cards.values()) {
            const img = card.firstElementChild.firstElementChild;
            img.classList.remove('small-field');
            img.classList.remove('amount-field');
        }

        currentField = 'standard-field';
    }
    else if (box.getAttribute('data-type-field') === 'small') {
        for (let card of cards.values()) {
            const img = card.firstElementChild.firstElementChild;
            img.classList.remove('amount-field');
            img.classList.add('small-field');
        }

        currentField = 'small-field';
    }
    else {
        for (let card of cards.values()) {
            const img = card.firstElementChild.firstElementChild;
            img.classList.remove('small-field');
            img.classList.add('amount-field');
        }

        currentField = 'amount-field';
    }
}

function dropAreaBehavior(target) {
    const dropArea = target.querySelector('.drop-area');
    preventOnDragStandartBehavior(dropArea);
    dropArea.classList.remove('not-active-content');

    dropArea.ondrop = (event) => {
        const images = event.dataTransfer.files;
        // to-do validation
        createCards(images, currentOrientation, currentField);
        resetCounter(images.length);
        addFiles(images);

        dropArea.classList.add('not-active-content');
        if (target === homeContents) {
            updateDocument();
        }

        return false;
    }

    dropArea.ondragleave = (event) => {
        dropArea.classList.add('not-active-content');
    }

    return false;
}

function resetCounter(count) {
    const counter = document.querySelector('.counter').firstElementChild;
    counter.textContent = +counter.textContent + count + '';
}

function addFiles(files) {
    const fileArray = Array.prototype.slice.call(files)
    global_files.push(...fileArray)
}

function removeFile(file_name) {
    global_files.splice(
        global_files.findIndex(file => file.name == file_name, 0)
    );
}
   

function preventOnDragStandartBehavior(element) {
    element.ondrag = (event) => event.preventDefault();
    element.ondragstart = (event) => event.preventDefault();
    element.ondragend = (event) => event.preventDefault();
    element.ondragover = (event) => event.preventDefault();
    element.ondragenter = (event) => event.preventDefault();
    element.ondragleave = (event) => event.preventDefault();
    element.ondrop = (event) => event.preventDefault();
}

function createCards(images, orientationCard, field) {
    const contents = document.querySelector('.contents');

    for (let image of images) {

        const cardContainer = document.createElement('div');
        const cardAlignment = document.createElement('div');
        const img = document.createElement('img');
        const closeImg = document.createElement('div');
        const text = document.createElement('span');

        cardContainer.draggable = true;
        cardContainer.id = guid();

        closeImg.draggable = false;

        img.draggable = false;
        img.src = window.URL.createObjectURL(image);
        img.name = image.name;
        // 25 == file-name + file-type
        text.textContent = image.name.length <= 25 ? image.name : `${image.name.slice(0, 22)}...`;

        cardContainer.classList.add('card-container', 'border-shadow', 'begin-state');
        cardAlignment.classList.add(orientationCard);
        closeImg.classList.add('delete-card');
        img.classList.add('image-box', field);
        text.classList.add('light-20');

        cardAlignment.append(img);
        cardContainer.append(cardAlignment, closeImg, text);

        cardContainer.ondragstart = (event) => {
            const phantomDiv = event.target.cloneNode(true);
            cardContainer.classList.add('ghost-card');
            cardContainer.classList.remove('begin-state');
            phantomDiv.classList.add('phantom-card');

            contents.append(phantomDiv);

            event.dataTransfer.setData("card", event.target.id);
            event.dataTransfer.setDragImage(phantomDiv, event.offsetX, event.offsetY);

            event.dataTransfer.effectAllowed =' all';

        }

        cardContainer.onclick = (event) => {
            if (event.target.classList.contains('delete-card')) {
                contents.removeChild(cardContainer);
                resetCounter(-1);
                //remove image
                const deleting_image = cardContainer.firstElementChild.firstElementChild
                removeFile(deleting_image.name)
            }
        }

        cardContainer.ondragover = (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        }

        cardContainer.ondragenter = (event) => {
            let itemChosen = document.querySelector('.ghost-card:not(.phantom-card)');
            if (event.target.id == "") { return false; }


            if (itemChosen.id !== event.target.id) {
                const listItems = document.querySelectorAll('.ghost-card ~ div:not(.phantom-card)');
                const listItemsReverse = contents.querySelectorAll('.card-container:not(.phantom-card)');

                const startElement = document.querySelector('.ghost-card').previousElementSibling;

                itemChosen.classList.remove('ghost-card');

                let result = false;

                for (let item of listItems.values()) {
                    if (item.id === event.target.id) {
                        result = true;
                    }
                }

                if (!result) {

                    let startIndex = listItemsReverse.length - 1;

                    for (let i = listItemsReverse.length - 1; i >= 0; i--) {

                        if (listItemsReverse[i].id === startElement.id) {
                            break;
                        }
                        startIndex--;
                    }

                    for (let i = startIndex; i >= 0; i--) {

                        const item = listItemsReverse[i];

                        const temporary = item.innerHTML;
                        item.innerHTML = itemChosen.innerHTML;
                        itemChosen.innerHTML = temporary;

                        itemChosen.classList.remove('ghost-card');
                        item.classList.add('ghost-card');
                        itemChosen = item;

                        if (item.id === event.target.id) {
                            break;
                        }
                    }
                }
                else {
                    for (let item of listItems) {

                        const temporary = item.innerHTML;
                        item.innerHTML = itemChosen.innerHTML;
                        itemChosen.innerHTML = temporary;

                        itemChosen.classList.remove('ghost-card');
                        item.classList.add('ghost-card');
                        itemChosen = item;

                        if (item.id === event.target.id) {
                            break;
                        }
                    }
                }

                document.querySelector('.phantom-card').hidden = true;
            }
        }
        
        cardContainer.ondragend = (event) => {
            contents.removeChild(document.querySelector('.phantom-card'));
            event.target.classList.add('begin-state');
            
            const itemChosen = document.querySelector('.ghost-card');
            if (itemChosen != null) itemChosen.classList.remove('ghost-card');
        }

        contents.append(cardContainer);
    }
}

function updateDocument() {
    homeContents.classList.add('not-active-content');
    contents.classList.remove('not-active-content');
    convertSettings.classList.remove('not-active-content');
}

function guid() {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// submit data
convertButton.addEventListener('click', async (event) => {
    let formData = seekForm(global_files, 'files');

    const response = await fetch('upload', {
        method: 'post',
        body: formData
    });

    if (response.status == 200) {
        window.location.href = `download/${response.headers.get('uri')}`
    }
    else {
        console.error('Something went wrong');
    }
});

function seekForm(images, fileName) {
    let formData = new FormData();

    for (let img of images) {
        formData.append(fileName, img)
    }

    return formData;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}




