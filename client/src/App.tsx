import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import './App.css';
import Navbar from './components/navbar';
import Home from './pages/home';
import Game from './pages/game';
import GameStart from './pages/game-start';
import GameOver from './pages/game-over';
import AddUser from './pages/signup';
import LoginUser from './pages/login';
import ShowUser from './pages/showUser';
import UpdateUser from './pages/updateUser';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import { User, UserContext, UserContextProps } from './UserContext';
import { config } from './config/config';
import "./styles/main.scss"

const URL = config.url;

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem('id');
  
    if (id) {
      fetch(`${URL}/user/show/${id}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
            setUser(data);
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  }, []); 
  

  const value: UserContextProps = useMemo(
    () => ({ user, setUser: setUser as Dispatch<SetStateAction<User | null>> }),
    [user, setUser]
  );

  return (
    <Router>
      <UserContext.Provider value={value}>
        <div className="App" id="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<AddUser />} />
            <Route path="/login" element={<LoginUser />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/game" element={<Game/>} />
              <Route path="/game-start" element={<GameStart/>} />
              <Route path="/game-over" element={<GameOver/>} />
              <Route path="/user/show/:id" element={<ShowUser />} />
              <Route path="/user/update/:id" element={<UpdateUser />} />
            </Route>
          </Routes>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
