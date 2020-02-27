document.addEventListener('DOMContentLoaded', () => {
    addToAction = (event) => {
        let board = event.target.elements['board'].value;
        event.target.action = `/api/threads/${board}`;
    };

    addElement = (parentId, elementTag, elementId, elementClass='', html='') => {
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

    const newThreadForm = document.getElementById('new-thread');
    newThreadForm.addEventListener("submit", addToAction);

    const searchBoard = document.getElementById('search-board');
    searchBoard.addEventListener("submit", getBoards);

    const info = document.getElementById('info');
    info.addEventListener("click", () => {
        const block = document.getElementById('info-block');
        if (block.classList.contains('hidden')) {
            block.classList.remove('hidden');
            block.classList.remove('block');
            block.classList.add('visible');
            info.style.animationName = 'clicked';
            info.style.animationFillMode = 'forwards';
        } else {
            block.classList.remove('visible');
            block.classList.add('hidden');
            info.style.animationName = '';
        }
    });
});