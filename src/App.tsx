import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider } from '@/contexts';
import GamePage from './pages/GamePage';
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}

export default App;
