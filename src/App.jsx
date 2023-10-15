import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data/data"
import Split from "react-split"
import {nanoid} from "nanoid"

function App() {
    const [notes, setNotes] = useState(
        ()=> JSON.parse(localStorage.getItem('notes')) || []
    )
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0] && notes[0].id) || ""
    )
    
    useEffect(()=>{
        localStorage.setItem('notes', JSON.stringify(notes))
    },[notes])

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        setNotes(oldNotes => {
            const newNote = []
            oldNotes.forEach(el => {
                if(el.id === currentNoteId){
                    newNote.unshift({
                        ...el,
                        body: text
                    })
                }else {
                    newNote.push(el)
                }
            })
            return newNote
        })
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }

    function deleteNote(event, noteId) {
        event.stopPropagation();
        setNotes((prevNote)=> {
            return prevNote.filter(note => note.id !== noteId)
        })

    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1 className="text-3xl font-bold mx-2">You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}


export default App
