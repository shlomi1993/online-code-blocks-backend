import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import '../App.css'

const backendUri = 'http://localhost:8080/';

function CodeBlock() {

  const location = useLocation();

  const blockId = location.state.codeblock.block_id;
  const blockName = location.state.codeblock.block_name;
  const [code, setCode] = useState(location.state.codeblock.code);
  const socket = io(backendUri);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [userType, setUserType] = useState(null);

  useEffect(() => {

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.emit('join_room', blockId);
    
    socket.on('get_type', (userType) => setUserType(userType));

    socket.on('recieve_message', (message) => setCode(message));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [socket]);

  const onChange = (newCode) => {
    if (userType === 'student') {
      setCode(newCode);
      socket.emit('send_message', { roomId: blockId, message: newCode });
    }
  }

  return (
    <div className='CodeBlock'>
      <h2 className='CodeBlock-h2'>{blockName}</h2>
      <h4 className='CodeBlock-h2'>Connected as: {userType}</h4>
      <div className='CodeBlock-Editor'>
        <Editor
          value={code}
          onValueChange={input => onChange(input)}
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