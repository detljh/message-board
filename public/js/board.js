document.addEventListener('DOMContentLoaded', () => {
    const board = window.location.pathname.slice(3);

    (loadThreads = () => {
        const http = new XMLHttpRequest();
        http.open("GET", `/api/threads/${board}`, true);
        http.setRequestHeader('Content-Type', 'application/json');

        http.onload = () => {
            if (http.status == 200) {
                const threads = JSON.parse(http.responseText);
                threads.forEach(thread => {
                    addThread(board, thread);
                });

                const reportThreads = document.getElementsByClassName('report-thread');
                for (let i = 0; i < reportThreads.length; i++) {
                    reportThreads[i].addEventListener("submit", reportAction);
                }
                
                const reportReplies = document.getElementsByClassName('report-reply');
                for (let i = 0; i < reportReplies.length; i++) {
                    reportReplies[i].addEventListener("submit", reportAction);
                }  
            } else {
                window.location.href = '/';
            }
        };

        http.send();
    })();

    let html = `Welcome to /b/${board}`;
    addElement('page-title', 'h2', 'top', 'container-title', html);
    window.document.title = `/b/${board}`;

    const newThreadForm = document.getElementById('new-thread');
    newThreadForm.addEventListener("submit", addBoardToAction);
});