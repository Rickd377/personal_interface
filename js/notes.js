document.addEventListener('DOMContentLoaded', function() {
    const notesTextarea = document.getElementById('notes-textarea');
    const saveNotesButton = document.getElementById('save-notes-button');
    const notesList = document.getElementById('notes-list');

    // Function to set a cookie
    const setCookie = (name, value, days) => {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    };

    // Function to get a cookie
    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    // Function to delete a cookie
    const deleteCookie = (name) => {
        document.cookie = name + "=; Max-Age=-99999999;";
    };

    // Load notes from cookie on page load
    const loadNotes = () => {
        const savedNotes = getCookie('userNotes');
        if (savedNotes) {
            const notesArray = JSON.parse(savedNotes);
            notesArray.forEach(note => addNoteToList(note));
        }
    };

    // Save notes to cookie
    const saveNotes = () => {
        const notes = [];
        notesList.querySelectorAll('li').forEach(li => {
            notes.push(li.textContent.replace('Delete', '').trim());
        });
        setCookie('userNotes', JSON.stringify(notes), 30); // Save for 30 days
    };

    // Add note to the list
    const addNoteToList = (note) => {
        const li = document.createElement('li');
        li.textContent = note;
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            li.remove();
            saveNotes();
        });
        li.appendChild(deleteButton);
        notesList.appendChild(li);
    };

    saveNotesButton.addEventListener('click', () => {
        const note = notesTextarea.value.trim();
        if (note) {
            addNoteToList(note);
            notesTextarea.value = '';
            saveNotes();
        }
    });

    // Load notes when the page loads
    loadNotes();
});