document.addEventListener('DOMContentLoaded', () => {
    const board = window.location.pathname.slice(3);

    (loadThreads = () => {
        const http = new XMLHttpRequest();
        http.open("GET", `/api/threads/${board}`, true);
        http.setRequestHeader('Content-Type', 'application/json');

        http.onload = () => {
            const threads = JSON.parse(http.responseText);
            threads.forEach(thread => {
                addThread(board, thread);
            });
        };

        http.send();
    })();

    let html = `Welcome to /b/${board}`;
    addElement('board-title', 'h2', 'top', 'container-title', html);
    window.document.title = `/b/${board}`;

    const newThreadForm = document.getElementById('new-thread');
    newThreadForm.addEventListener("submit", addBoardToAction);
});