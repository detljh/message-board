document.addEventListener('DOMContentLoaded', () => {
    addBoardToAction = (event) => {
        let board = window.location.pathname.slice(3);
        if (event.target.elements['board']) {
            board = event.target.elements['board'].value
        }
     
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
    };

    reportAction = (event) => {
        event.preventDefault();
        const board = window.location.pathname.split('/')[2];

        let url = `/api/threads/${board}`
        let data = {report_id: event.target.elements['report_id'].value};
        if (event.target.className.includes('reply')) {
            url = `/api/replies/${board}`;
            data.thread_id = event.target.elements['thread_id'].value;
        }

        const http = new XMLHttpRequest();
        http.open("PUT", url, true);
        http.setRequestHeader('Content-Type', 'application/json', true);

        http.onload = () => {
            alert(http.responseText);
        };

        http.send(JSON.stringify(data));
    }

    deleteAction = (event) => {
        event.preventDefault();
        const board = window.location.pathname.split('/')[2];

        let url = `/api/threads/${board}`
        let data = {thread_id: event.target.elements['thread_id'].value, delete_password: event.target.elements['delete_password'].value};
        if (event.target.className.includes('reply')) {
            url = `/api/replies/${board}`;
            data.reply_id = event.target.elements['reply_id'].value;
        }

        const http = new XMLHttpRequest();
        http.open("DELETE", url, true);
        http.setRequestHeader('Content-Type', 'application/json', true);

        http.onload = () => {
            alert(http.responseText);
        };

        http.send(JSON.stringify(data));
    }

    attachDeleteReportEventListeners = () => {
        const reportThreads = document.getElementsByClassName('report-thread');
        for (let i = 0; i < reportThreads.length; i++) {
            reportThreads[i].addEventListener("submit", reportAction);
        }
        
        const reportReplies = document.getElementsByClassName('report-reply');
        for (let i = 0; i < reportReplies.length; i++) {
            reportReplies[i].addEventListener("submit", reportAction);
        }  

        const deleteThreads = document.getElementsByClassName('delete-thread');
        for (let i = 0; i < deleteThreads.length; i++) {
            deleteThreads[i].addEventListener("submit", deleteAction);
        }
        
        const deleteReplies = document.getElementsByClassName('delete-reply');
        for (let i = 0; i < deleteReplies.length; i++) {
            deleteReplies[i].addEventListener("submit", deleteAction);
        }  
    }

    addThread = (board, thread) => {
        let hiddenCount = thread.replycount - 3;
        hiddenCount = hiddenCount < 1 ? 0 : hiddenCount;
        let html = `<div class="thread-header">
                    <p class="id"><b class="id-label">id:</b> ${thread._id} (${thread.created_on})</p>
                    <form class="delete-thread">
                    <input type="hidden" name="thread_id" value=${thread._id}>
                    <input type="text" name="delete_password"></input>
                    <button type="submit"><i class="fas fa-trash-alt"></i></button></form>
                    <form class="report-thread">
                    <input type="hidden" name="report_id" value=${thread._id}>
                    <button type="submit"><i class="fas fa-flag"></i></button></form></div>
                    <div class="thread-body">
                    <p class="body-text">${thread.text}</p>
                    <p class="reply-count">${thread.replycount} <a href="/b/${board}/${thread._id}"><i class="fas fa-comments"></i></a> (${hiddenCount} hidden)</p> 
                    <div class="replies">`

        thread.replies.forEach(reply => {
            html += `<div class="reply" id=${reply._id}>
                    <div class="reply-header">
                    <p class="id"><b class="id-label">id:</b> ${reply._id} (${reply.created_on})</p>
                    <form class="delete-reply">
                    <input type="hidden" name="thread_id" value=${thread._id}>
                    <input type="hidden" name="reply_id" value=${reply._id}>
                    <input type="text" name="delete_password"></input>
                    <button type="submit"><i class="fas fa-trash-alt"></i></button></form>
                    <form class="report-reply">
                    <input type="hidden" name="thread_id" value=${thread._id}>
                    <input type="hidden" name="report_id" value=${reply._id}>
                    <button type="submit"><i class="fas fa-flag"></i></button></form></div>
                    <div class="reply-body">
                    <p class="body-text">${reply.text}</p></div></div>`
        });
        
        html += `<div class="new-reply-container">
                <form action="/api/replies/${board}" method="post" id="new-reply">
                <input type="hidden" name="thread_id" value=${thread._id}>
                <textarea name="text" placeholder="reply..."></textarea>
                <button type="submit"><i class="fas fa-comment"></i></button></form></div></div>`;
        addElement('main', 'div', thread._id, 'thread', html);
    }
    
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
            setTimeout(() => {
                block.classList.add('block');
            }, 500);
        }
    }); 
});