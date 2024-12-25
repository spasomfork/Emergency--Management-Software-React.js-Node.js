import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, InputGroup, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { role } from './Navbar'; // Import role

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';

  const questions = [
    'Get All Damage Reports',
    'Get Damage Reports with Severity Level "High"',
    'Get Damage Reports with Severity Level "Mild"',
    'Get Damage Reports with Severity Level "Low"',
    'Count Total Number of Damage Reports',
    'Get All Evacuation Centers with Capacity Greater than 100',
    'Get Average Capacity of Hospitals',
    'Find Maximum Capacity of Evacuation Centers',
    'Get Total Number of Resources',
    'Get All Personnel with Role "Admin"',
    'Get All Personnel with Role "Relief Organization"',
    'Get All Personnel with Role "User"',
    'Get Total Damage Reported for Each Severity Level',
    'Find Incidents with Description Containing "Flood"',
    'Get Minimum Quantity of Resources',
    'Get All Tasks Assigned to a Specific User',
  ];

  useEffect(() => {
    setMessages([{ user: 'Bot', text: 'Welcome to the chat!' }]);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();

    const query = selectedQuestion || input;
    if (!query.trim()) return;

    const newMessages = [...messages, { user: username, text: query }];
    setMessages(newMessages);

    try {
      const response = await axios.post(
        'http://localhost:5000/chat/ask',
        { query },
        { withCredentials: true }
      );
      setMessages([...newMessages, { user: 'Bot', text: response.data.message || JSON.stringify(response.data) }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages([...newMessages, { user: 'Bot', text: 'Error: Could not fetch response.' }]);
    }

    setInput('');
    setSelectedQuestion('');
  };

  return (
    <div className="main-content-chat d-flex flex-column p-3" style={{ width: '80%' }}>
      <Container className="flex-grow-1 chat-window bg-light p-3" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 d-flex ${msg.user === username ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              style={{
                maxWidth: '60%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: msg.user === username ? '#007bff' : '#f1f1f1',
                color: msg.user === username ? 'white' : 'black',
              }}
            >
              <strong>{msg.user}: </strong>{msg.text}
            </div>
          </div>
        ))}
      </Container>

      <InputGroup className="mt-3" style={{ marginLeft: '280px', marginRight: '200px', width: '80%' }}>
        <Form.Select
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">Select a question...</option>
          {questions.map((question, index) => (
            <option key={index} value={question}>
              {question}
            </option>
          ))}
        </Form.Select>
        <Form.Control
          placeholder="Type a custom query..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="primary" onClick={handleSend}>
          Send
        </Button>
      </InputGroup>
    </div>
  );
};

export default Chat;
