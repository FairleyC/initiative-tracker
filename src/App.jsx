import EncounterList from './components/EncounterList'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#cccccc]">
      <div className="w-full min-h-screen px-6 py-8">
        <header className="mb-12">
          <div className="bg-[#252526] p-1 rounded-lg shadow-lg mb-2 ring-1 ring-[#2d2d2d]">
            <div className="rounded-md">
              <h1 className="text-4xl md:text-5xl font-extrabold text-center py-6 bg-clip-text text-[#cccccc]">
                Initiative Tracker
              </h1>
            </div>
          </div>
        </header>
        <main className="bg-[#252526] rounded-xl shadow-xl p-6 ring-1 ring-[#2d2d2d]">
          <EncounterList />
        </main>
        <footer className="mt-6 text-center text-sm text-[#8c8c8c]">
          <p>Keyboard Shortcuts:</p>
          <p className="mt-1">Press <kbd className="px-1 py-0.5 bg-[#333333] rounded">Ctrl +</kbd> to add a new encounter</p>
          <p className="mt-1">Press <kbd className="px-1 py-0.5 bg-[#333333] rounded">+</kbd> to add a new character to the top encounter</p>
        </footer>
      </div>
    </div>
  )
}

export default App
