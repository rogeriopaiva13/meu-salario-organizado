import React, { useState } from 'react';

export default function App() {
  const [salario, setSalario] = useState('');
  const [contas, setContas] = useState('');

  const saldo =
    (Number(salario) || 0) -
    (Number(contas) || 0);

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '400px',
        margin: '40px auto',
        fontFamily: 'Arial',
        textAlign: 'center'
      }}
    >
      <h1>💰 Meu Salário Organizado</h1>

      <p>Organize seu dinheiro de forma simples</p>

      <input
        type="number"
        placeholder="Salário"
        value={salario}
        onChange={(e) => setSalario(e.target.value)}
        style={{
          width:'100%',
          padding:'12px',
          marginBottom:'10px'
        }}
      />

      <input
        type="number"
        placeholder="Contas"
        value={contas}
        onChange={(e) => setContas(e.target.value)}
        style={{
          width:'100%',
          padding:'12px'
        }}
      />

      <h2 style={{marginTop:'20px'}}>
        Saldo: R$ {saldo}
      </h2>
    </div>
  );
}
