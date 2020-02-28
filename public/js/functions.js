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

    addThread = (board, thread) => {
        let replyText = thread.replycount == 1 ? `${thread.replycount} reply total` : `${thread.replycount} replies total`;
        let hiddenCount = thread.replycount - 3;
        hiddenCount = hiddenCount < 1 ? 0 : hiddenCount;
        let html = `<div class="thread-header">
                    <p class="id">id: ${thread._id} (${thread.created_on})</p>
                    <form class="report-thread">
                    <input type="hidden" name="report_id" value=${thread._id}>
                    <button type="submit"><i class="fas fa-flag"></i></button></form>
                    <form class="delete-thread">
                    <input type="hidden" name="thread_id" value=${thread._id}>
                    <input type="text" name="delete_password"></input>
                    <button type="submit"><i class="fas fa-trash-alt"></i></button></form></div>
                    <p class="body-text">${thread.text}</p>
                    <p class="reply-count">${replyText} (${hiddenCount} hidden) - <a href="/b/${board}/${thread._id}">See the full thread</a></p>
                    <div class="replies">`

        thread.replies.forEach(reply => {
            html += `<div class="reply">
                    <div class="reply-header">
                    <p class="id">id: ${reply._id} (${reply.created_on})</p>
                    <form class="report-reply">
                    <input type="hidden" name="thread_id" value=${thread._id}>
                    <input type="hidden" name="report_id" value=${reply._id}>
                    <button type="submit"><i class="fas fa-flag"></i></button></form>
                    <form class="delete-reply">
                    <input type="hidden" name="reply_id" value=${reply._id}>
                    <input type="text" name="delete_password"></input>
                    <button type="submit"><i class="fas fa-trash-alt"></i></button></form></div>
                    <p class="body-text">${reply.text}</p></div>`
        });
        
        html += `<div class="new-reply-container">
                <form action="/api/replies/${board}" method="post" id="new-reply">
                <input type="hidden" name="thread_id" value=${thread._id}>
                <textarea name="text" placeholder="reply..."></textarea>
                <button type="submit"><i class="fas fa-plus"></i></button></form></div>`;
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