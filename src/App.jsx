import TurnOrderList from './components/TurnOrderList'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#cccccc]">
      <div className="w-full min-h-screen px-6 py-8">
        <header className="mb-12">
          <div className="bg-[#252526] p-1 rounded-lg shadow-lg mb-2 ring-1 ring-[#2d2d2d]">
            <div className="rounded-md">
              <h1 className="text-4xl md:text-5xl font-extrabold text-center py-6 bg-clip-text text-[#cccccc]">
                D&D Initiative Tracker
              </h1>
            </div>
          </div>
          <p className="text-[#858585] text-center text-sm md:text-base animate-fade-in">
            Track your party's initiative with style
          </p>
        </header>
        <main className="bg-[#252526] rounded-xl shadow-xl p-6 ring-1 ring-[#2d2d2d]">
          <TurnOrderList />
        </main>
      </div>
    </div>
  )
}

export default App
