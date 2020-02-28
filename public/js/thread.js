document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.pathname.split('/');
    const board = url[2];
    const thread_id = url[3];

    (loadThread = () => {
        const http = new XMLHttpRequest();
        http.open("GET", `/api/replies/${board}?thread_id=${thread_id}`, true);
        http.setRequestHeader('Content-Type', 'application/json');

        http.onload = () => {
            const thread = JSON.parse(http.responseText);
            addThread(board, thread);
        };

        http.send();
    })();

    let html = `Welcome to /b/${board}/${thread_id}`;
    addElement('board-title', 'h2', 'top', 'container-title', html);
    window.document.title = `/b/${board}`;
});