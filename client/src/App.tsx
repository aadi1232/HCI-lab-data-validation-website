import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import ValidationPage from './components/ValidationPage'
import './App.css'

interface User {
  id: number;
  username: string;
  name: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>HCI Lab - Hand Sign Validation</h1>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </header>
        
        <main className="app-content">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/validate" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/validate" 
              element={user ? <ValidationPage user={user} /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} HCI Lab - Hand Sign Detection Project</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
