import React from 'react';

const StaticList = () => {
  // Dados estáticos (Mock)
  const products = [
    { id: 101, name: 'Notebook Dell XPS', price: 'R$ 8.500', stock: 5 },
    { id: 102, name: 'Monitor LG Ultrawide', price: 'R$ 1.200', stock: 12 },
    { id: 103, name: 'Teclado Mecânico Keychron', price: 'R$ 650', stock: 0 },
    { id: 104, name: 'Mouse Logitech MX Master', price: 'R$ 450', stock: 8 },
  ];

  return (
    <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Lista de Produtos (Estático)</h2>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {products.map((item) => (
          <li key={item.id} style={{ 
            padding: '10px', 
            borderBottom: '1px solid #eee',
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{item.name}</strong>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>ID: {item.id}</div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: '#0176d3' }}>{item.price}</div>
              {item.stock > 0 ? (
                 <span style={{ fontSize: '0.8rem', color: 'green' }}>Em estoque ({item.stock})</span>
              ) : (
                 <span style={{ fontSize: '0.8rem', color: 'red' }}>Esgotado</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaticList;