import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';

import Lobby from "./pages/Lobby";
import CodeBlock from "./pages/CodeBlock";
import Error from "./pages/Error";

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <h1><img src={require('./assets/logo.png')} className='App-Logo'/>Online Code Blocks</h1>
          <hr style={{
            color: 'white',
            background: 'white',
            height: '1px',
            width: '100%'
          }}/>
        </header>
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Lobby />} />
            <Route path="/codeblock" element={<CodeBlock />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
        <div>
          <p>Footer</p>
        </div>
      </Router>
    </div>
  );
}

export default App;
