import React from 'react';
import Chatbot from './components/Chatbot';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import { AnalysisProvider } from './contexts/AnalysisContext';

import { useState } from 'react';
const App: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <AnalysisProvider>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', transition: 'margin 0.3s', marginRight: chatOpen ? '400px' : 0 }}>
        <Box sx={{ flex: 1 }}>
          <Header />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analyze" element={<AnalysisPage />} />
              <Route path="/analysis/:id" element={<AnalysisPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </motion.main>
        </Box>
        <Chatbot open={chatOpen} setOpen={setChatOpen} />
      </Box>
    </AnalysisProvider>
  );
};

export default App;

