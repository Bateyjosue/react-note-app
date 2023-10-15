import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import { db, notesCollection } from "../firebase"

function App() {
    const [notes, setNotes] = useState([])
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0]?.id) || ""
    )

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]
    
    useEffect(()=>{
        const unsubscribe = onSnapshot(notesCollection, (snapshot)=> {
            const noteArray = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }))
            setNotes(noteArray)
        })
        return unsubscribe
    },[])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here"
        }
        
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
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
