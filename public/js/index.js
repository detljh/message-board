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
            
            let html = `Visit <a href="/b/${randomBoard.board}">/b/${randomBoard.board}</a>`
            addElement('random-board', 'h2', '', 'container-title', html);
            
            html = `<div class="thread">
                    <div class="thread-header">
                    <p class="id"><b class="id-label">id:</b> ${randomBoard._id} (${randomBoard.created_on})</p></div>
                    <div class="thread-body">
                    <p>${randomBoard.text}</p>
                    <p class="reply-count">${randomBoard.replycount} <a href="/b/${randomBoard.board}/${randomBoard._id}"><i class="fas fa-comments"></i></a></p></div></div>`
            addElement('random-board', 'div', 'random-thread', 'container-body', html);
        }

        http.send();
    })();

    const newThreadForm = document.getElementById('new-thread');
    newThreadForm.addEventListener("submit", addBoardToAction);

    const searchBoard = document.getElementById('search-board');
    searchBoard.addEventListener("submit", getBoards);
});