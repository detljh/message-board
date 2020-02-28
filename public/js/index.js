document.addEventListener('DOMContentLoaded', () => {
    addToAction = (event) => {
        let board = event.target.elements['board'].value;
        event.target.action = `/api/threads/${board}`;
    };

    addElement = (parentId, elementTag, elementId='', elementClass='', html='') => {
        let parent = document.getElementById(parentId);
        let newElement = document.createElement(elementTag);
        newElement.setAttribute('id', elementId);
        newElement.setAttribute('class', elementClass);
        newElement.innerHTML = html;
        parent.appendChild(newElement);
    };

    removeChildrenFromParent = (parentId, childTag='') => {
        const parent = document.getElementById(parentId);
        if (childTag.length > 0) {
            parent.removeChild(childTag);
            return;
        }

        let child = parent.lastElementChild
        while (child) {
            parent.removeChild(child);
            child = parent.lastElementChild;
        }
    }

    (getBoards = (event) => {
        let board = '';
        if (event) {
            board = event.target.elements['board'].value;
            event.preventDefault();
        }

        const http = new XMLHttpRequest();
        http.open("POST", '/api/boards', true);
        http.setRequestHeader('Content-Type', 'application/json');

        http.onload = () => {
            removeChildrenFromParent('boards');
            const boards = JSON.parse(http.responseText);
            boards.forEach(board => {
                let html = `<a href=/b/${encodeURI(board.name)}>${board.name}</a>`
                addElement('boards', 'div', board._id, 'board-name', html);
            });
        }

        http.send(JSON.stringify({board: board}));
    })();

    (loadRandomBoard = () => {
        const http = new XMLHttpRequest();
        http.open("GET", '/api/thread', true);
        http.setRequestHeader('Content-Type', 'application/json');

        http.onload = () => {
            const randomBoard = JSON.parse(http.responseText);
            let html = `Visit <a href="/b/${randomBoard.board}">/b/${randomBoard.board}</a>`
            addElement('random-board', 'h2', '', 'container-title', html);
            html = `<div class="main">
                        <p class="id">id: ${randomBoard._id} (${randomBoard.created_on})</p>
                        <h3>${randomBoard.text}</h3></div>
                        <h5>${randomBoard.replycount} replies total - <a href="/b/${randomBoard.board}/${randomBoard._id}">See the full thread here</a>.</h5>`
            addElement('random-board', 'div', 'random-thread', 'thread', html);
        }

        http.send();
    })();

    const newThreadForm = document.getElementById('new-thread');
    newThreadForm.addEventListener("submit", addToAction);

    const searchBoard = document.getElementById('search-board');
    searchBoard.addEventListener("submit", getBoards);

    const infoElement = document.getElementById('info');
    infoElement.addEventListener("click", () => {
        const block = document.getElementById('info-block');
        if (block.classList.contains('hidden')) {
            block.classList.remove('hidden');
            block.classList.remove('block');
            block.classList.add('visible');
            infoElement.style.animationName = 'clicked';
            infoElement.style.animationFillMode = 'forwards';
        } else {
            block.classList.remove('visible');
            block.classList.add('hidden');
            infoElement.style.animationName = '';
        }
    });
});