import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"

function App() {
    const [notes, setNotes] = useState(
        ()=> JSON.parse(localStorage.getItem('notes')) || []
    )
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0]?.id) || ""
    )

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]
    
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
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={currentNote} 
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
