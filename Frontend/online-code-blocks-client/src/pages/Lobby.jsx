import React, { Component, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import '../App.css';

const backendUri = 'http://localhost:8080/';

function Lobby() {

  const navigate = useNavigate();

  const [blockList, setBlockList] = useState([]);

  const fetchBlockList = async () => {
    let uri = backendUri + 'getAllCodeBlocks';
    fetch(uri)
      .then(resp => resp.json())
      .then(data => setBlockList(data))
  }

  useEffect(() => {
    fetchBlockList();
  }, [])

  const navigateToCodeBlock = (codeblock) => {
    let state = {
      state: {
        codeblock: codeblock
      }
    }
    // sendPing();
    navigate('./CodeBlock', state);
  }

  const removeCodeBlock = (codeblock) => {

  };

  const content = <div>
    <h2 className='Lobby-Guideline'>Select code block</h2>
    <div className="Lobby-List">
      {blockList.map((cb) => {
        return (
          <Box width='350px' className='Lobby-Card'>
              <Card>
                  <CardContent>
                      <div className='Lobby-CardText'>
                        <Typography gutterBottom variant='h5' component='div'>
                            {cb.block_name}
                        </Typography>
                      </div>
                      <div className='Lobby-CardButtons'>
                        <Button variant='text' onClick={() => navigateToCodeBlock(cb)}>Join</Button>
                        <Button variant='text' onClick={() => removeCodeBlock(cb)}>Remove</Button>
                      </div>
                  </CardContent>
              </Card>
          </Box>    
        );
      })}
    </div>
  </div>

  const loading = <div>
      <img src={require('../assets/loading.gif')} className='Lobby-Loading'/>
      <h2>Loading...</h2>
    </div>;

  return (
    blockList.length === 0 ? loading : content
  );
}
 
export default Lobby;