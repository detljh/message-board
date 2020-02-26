document.addEventListener('DOMContentLoaded', () => {
    const addToAction = (event) => {
        let board = event.target.elements['board'].value;
        event.target.action = `/api/threads/${board}`;
    };

    const addElement = (parentId, elementTag, elementId, elementClass='', html='') => {
        let parent = document.getElementById(parentId);
        let newElement = document.createElement(elementTag);
        newElement.setAttribute('id', elementId);
        newElement.setAttribute('class', elementClass);
        newElement.innerHTML = html;
        parent.appendChild(newElement);
    };

    const newThreadForm = document.getElementById('new-thread');
    newThreadForm.addEventListener("submit", addToAction);

    const searchBoard = document.getElementById('search-board');
    const http = new XMLHttpRequest();
    http.open("GET", '/api/boards', true);
    http.send();
    
    http.onload = () => {
        const boards = JSON.parse(http.responseText);
        boards.forEach(board => {
            let html = `<a href=/b/${encodeURI(board.name)}>${board.name}</a>`
            addElement('boards', 'div', board._id, 'board-name', html);
        })
    };
});