import React, { useState, useEffect } from 'react';

const ExternalData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setData(null);

    // Timestamp para evitar cache do navegador
    fetch(`https://jsonplaceholder.typicode.com/todos/1?t=${new Date().getTime()}`)
      .then((response) => {
        if (!response.ok) throw new Error('Erro na conexão');
        return response.json();
      })
      .then((json) => {
        // Delay artificial de 500ms só para você ver o loading acontecer
        setTimeout(() => {
            setData(json);
            setLoading(false);
        }, 500);
      })
      .catch((err) => {
        console.error(err);
        setError('Falha ao obter dados.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Integração API</h2>
        
        {/* Botão de Refresh */}
        <button 
          onClick={fetchData} 
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0176d3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      {loading && <p>Buscando dados no servidor...</p>}
      
      {error && <p style={{ color: '#c23934' }}>{error}</p>}

      {!loading && !error && data && (
        <div style={{ background: '#f4f6f9', padding: '15px', borderRadius: '4px' }}>
          <p><strong>ID:</strong> {data.id}</p>
          <p><strong>Tarefa:</strong> {data.title}</p>
          <p>
            <strong>Status: </strong> 
            <span style={{ color: data.completed ? 'green' : 'orange' }}>
              {data.completed ? 'Concluída' : 'Pendente'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ExternalData;