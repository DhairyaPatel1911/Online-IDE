import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Button } from 'react-bootstrap';
import { Form, Col, Container, Row } from 'react-bootstrap';
import './Code.css'

const Code = () => {

    const [code, setCode] = useState('');
    const [input, setInput] = useState(0);
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState(53)

    let Compile = (e) => {
        
        e.preventDefault();
        let outputText = document.getElementById('output')

        const get_token = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {base64_encoded: 'true', fields: '*'},
            headers: {
              'content-type': 'application/json',
              'Content-Type': 'application/json',
              accept: "application/json",
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
              'X-RapidAPI-Key': '66cd21afc5msh0868887ae8d6b39p13e493jsn106bb5a05a47'
            },
            data: JSON.stringify({
                source_code: code,
                stdin: input,
                language_id: language,
              }),
          };
          
          axios.request(get_token).then((response) => {
              let token = response.data.token
              const get_output = {
                method: 'GET',
                url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
                params: {base64_encoded: 'true', fields: '*'},
                headers: {
                  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                  'X-RapidAPI-Key': '66cd21afc5msh0868887ae8d6b39p13e493jsn106bb5a05a47'
                }
              };
              
              axios.request(get_output).then((response) => {

                  let isStdout = response.data.stdout
                  if (isStdout) {
                    let Output = atob(response.data.stdout)
                    setOutput(Output)
                    outputText.innerHTML = ''
                    outputText.innerHTML += Output

                      
                  } 
                  else if(response.data.stderr){
                      let error = atob(response.data.stderr)
                      setOutput(error)
                      outputText.innerHTML = ''
                      outputText.innerHTML += error
                  }
                  else {
                    setOutput(response.data.status.description)
                    let outputErr = atob(response.data.status.description)
                    outputText.innerHTML = ''
                    outputText.innerHTML += outputErr
                  }
              }).catch((error) => {
                  console.error(error);
              });
          }).catch((error) => {
              console.error(error);
          });   
    }

    useEffect(() => {
      const storedLanguage = localStorage.getItem('Language');
      const storedCode = localStorage.getItem('Code');
      const storedInput = localStorage.getItem('Input');

      setLanguage(storedLanguage);
      setCode(storedCode);
      setInput(storedInput);

    }, [])
    

  return (
        <Container fluid>
            <Row>
                <Col md={4}>
                    <h4>Write your Code here</h4>
                </Col>
                <Col>
                <div className='language_selector'>
                    <h6>Language : </h6>
                    <Form.Select aria-label="Language" onChange={ (e) => {
                        setLanguage(e.target.value)
                        localStorage.setItem('Language', e.target.value);
                        console.log(e.target.value)
                        }}
                        >
                        <option value={53}>C++</option>
                        <option value={50}>C</option>
                        <option value={62}>Java</option>
                        <option value={71}>Python(3.8.1)</option>
                    </Form.Select>
                </div>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                    <textarea 
                    id='code'
                    rows="20" 
                    cols="120" 
                    onChange={(e) => {
                        e.preventDefault();
                        setCode(e.target.value);
                        localStorage.setItem('Code', e.target.value)
                    }
                    }
                    defaultValue = {code}
                    ></textarea>
                </Col>
                <Col>
                    <Button variant="primary" onClick={Compile}>Run</Button>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                    <h6>Input</h6>
                    <textarea 
                    rows="10" 
                    cols="50"
                    onChange={(e) => {
                        e.preventDefault();
                        setInput(e.target.value);
                        localStorage.setItem('Input', e.target.value)
                    }
                    }
                    defaultValue={input}
                    ></textarea>
                </Col>
                <Col>
                    <h6>Output</h6>
                    <textarea 
                    id='output' 
                    rows="10" 
                    cols="50" 
                    defaultValue={output}>
                    </textarea>
                </Col>
            </Row>
        </Container>
  )
}

export default Code