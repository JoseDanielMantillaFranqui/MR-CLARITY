import Form from "./screens/Form"
import Home from "./screens/Home"
import Response from "./screens/Response"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


const App = () => {
    return <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/form' element={<Form />} />
      <Route path='/response' element={<Response />} />
    </Routes>
  </Router>
}

export default App