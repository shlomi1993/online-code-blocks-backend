// Written by Shlomi Ben-Shushan.

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import { Button } from '@mui/material';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import '../App.css'

const backendUri = require('../config.json').backend;
const socket = io.connect(backendUri);

function CodeBlock() {

  const navigate = useNavigate();
  const location = useLocation();

  const blockId = location.state.codeblock.block_id;
  const blockName = location.state.codeblock.block_name;
  const [code, setCode] = useState(location.state.codeblock.code);
  
  const [isConnected, setIsConnected] = useState(false);
  const [userType, setUserType] = useState(null);
  
  const ans = useState(location.state.codeblock.answer);
  const [smile, setSmile] = useState(false);

  const onClickBack = () => {
    socket.emit('bye', { roomId: blockId, socketId: socket.id });
    setIsConnected(false);
    navigate('../');
  }

  const joinRoom = () => {
    socket.emit('join_room', blockId);
    setIsConnected(true);
    fetch(`${backendUri}getMentor?blockId=${blockId}`)
      .then(resp => resp.json())
      .then(data => {
        if (data.mentorId === socket.id) {
          setUserType('Mentor');
        } else {
          setUserType('Student');
        }
      })
  }

  const onClickSave = () => {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    };
    fetch(`${backendUri}updateblock?id=${blockId}&name=${blockName}`, options)
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      });
  }

  const onCodeChange = (newCode) => {
    if (userType === 'Student') {
      setCode(newCode);
      socket.emit('send_message', { roomId: blockId, message: newCode });
      if (newCode === ans[0]) {
        setSmile(true);
      } else {
        setSmile(false);
      }
    }
  }

  useEffect(() => {
    window.onpopstate = () => {
      socket.emit('bye', { roomId: blockId, socketId: socket.id });
      socket.disconnect();
      setIsConnected(false);
    }
    window.onbeforeunload = (e) => {
      socket.emit('bye', { roomId: blockId, socketId: socket.id });
      socket.disconnect();
      setIsConnected(false);
    };
  });

  useEffect(() => {
    joinRoom();
    socket.on('recieve_message', (message) => {
      setCode(message);
    });
  }, [socket]);

  return (
    <div className='CodeBlock'>
      <span className='CodeBlock-Button'>
        <Button variant='contained' onClick={onClickBack}>◄ Return</Button>
      </span>
      <span className='CodeBlock-Button'>
        <Button variant='contained' onClick={onClickSave}>Save</Button>
      </span>
      <div className='CodeBlock-Header'>
        <div>
          <h2 className='CodeBlock-h2'>{blockName}</h2>
          {userType && <h4 className='CodeBlock-h2'>Connected as: <i>{userType}</i></h4>}
          {!userType && <h4 className='CodeBlock-h2'>Click the "Connect" button to start.</h4>}
        </div>
        <div>
          <img src={require('../assets/success.gif')} className='CodeBlock-SuccessImg' width='160' hidden={!smile}></img>
        </div>
      </div>
      <div className='CodeBlock-Editor'>
        <Editor
          value={code}
          onValueChange={input => onCodeChange(input)}
          highlight={text => highlight(text, languages.js)}
          style={{
            height: 600,
            fontFamily: '"Proggy Fonts", "Fira Mono", monospace',
            fontSize: 16,
          }}
        />
      </div>
      <p className='CodeBlock-ID'>CodeBlock ID is {blockId}</p>
    </div>
  );
}

export default CodeBlock;