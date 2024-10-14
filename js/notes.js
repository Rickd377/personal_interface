document.addEventListener('DOMContentLoaded', function() {
    const notesTextarea = document.getElementById('notes-textarea'),
          saveNotesButton = document.getElementById('save-notes-button'),
          notesList = document.getElementById('notes-list'),
          setCookie = (name, value, days) => {
              const d = new Date();
              d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
              document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
          },
          getCookie = name => {
              const nameEQ = `${name}=`,
                    ca = document.cookie.split(';');
              for (let i = 0; i < ca.length; i++) {
                  let c = ca[i];
                  while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                  if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
              }
              return null;
          },
          deleteCookie = name => {
              document.cookie = `${name}=; Max-Age=-99999999;`;
          },
          loadNotes = () => {
              const savedNotes = getCookie('userNotes');
              if (savedNotes) JSON.parse(savedNotes).forEach(note => addNoteToList(note));
          },
          saveNotes = () => {
              const notes = [];
              notesList.querySelectorAll('li').forEach(li => {
                  notes.push(li.textContent.replace('Delete', '').trim());
              });
              setCookie('userNotes', JSON.stringify(notes), 30);
          },
          addNoteToList = note => {
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

    loadNotes();
});