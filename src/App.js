import './App.css';
import Code from './Code';
import Question from './Question';
import { Col, Container, Row } from 'react-bootstrap'
 
function App() {
  return (
    <Container>
      <Row>
        <Col md={3}>
          <Question/>
        </Col>
        <Col>
          <Code/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
