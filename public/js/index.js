document.addEventListener('DOMContentLoaded', () => {
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
            let replyText = randomBoard.replycount == 1 ? `${randomBoard.replycount} reply total` : `${randomBoard.replycount} replies total`;
            
            let html = `Visit <a href="/b/${randomBoard.board}">/b/${randomBoard.board}</a>`
            addElement('random-board', 'h2', '', 'container-title', html);
            
            html = `<p class="id">id: ${randomBoard._id} (${randomBoard.created_on})</p>
                    <p>${randomBoard.text}</p>
                    <p class="reply-count">${replyText} - <a href="/b/${randomBoard.board}/${randomBoard._id}">See the full thread</a></p>`
            addElement('random-board', 'div', 'random-thread', 'thread', html);
        }

        http.send();
    })();

    const newThreadForm = document.getElementById('new-thread');
    newThreadForm.addEventListener("submit", addBoardToAction);

    const searchBoard = document.getElementById('search-board');
    searchBoard.addEventListener("submit", getBoards);
});