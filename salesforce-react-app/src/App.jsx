import React from 'react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';

// Importando os componentes isolados
import ExternalData from './components/ExternalData';
import StaticList from './components/StaticList';

import './App.css';

function App({ initialRoute = "/" }) {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <div className="sf-card">
        
        {/* Menu de navegação apenas para teste local (opcional) */}
        <nav style={{ padding: '10px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
             <span style={{ marginRight: '10px', fontWeight: 'bold', color: '#555' }}>Rotas Disponíveis:</span>
             <Link to="/api-view" style={{ marginRight: '15px' }}>API View</Link>
             <Link to="/list-view">List View</Link>
        </nav>

        <Routes>
          {/* Rota 1: Chamada de API com botão de Refresh */}
          <Route path="/api-view" element={<ExternalData />} />

          {/* Rota 2: Lista Estática */}
          <Route path="/list-view" element={<StaticList />} />

          {/* Rota Default/Home */}
          <Route path="/" element={
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <h3>Selecione uma rota no App Builder</h3>
              <p>Configure o atributo <code>targetRoute</code> como <code>/api-view</code> ou <code>/list-view</code>.</p>
            </div>
          } />
          
          {/* Rota 404 */}
          <Route path="*" element={<div style={{color: 'red'}}>Página não encontrada</div>} />
        </Routes>

      </div>
    </MemoryRouter>
  );
}

export default App;