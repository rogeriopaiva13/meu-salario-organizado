import React, { useState, useEffect } from 'react';

export default function App() {
  const [salario, setSalario] = useState(
    localStorage.getItem('salario') || ''
  );

  const [extra, setExtra] = useState(
    localStorage.getItem('extra') || ''
  );

  const [contas, setContas] = useState(
    localStorage.getItem('contas') || ''
  );

  const [diaadia, setDiaadia] = useState(
    localStorage.getItem('diaadia') || ''
  );

  const [guardar, setGuardar] = useState(
    localStorage.getItem('guardar') || ''
  );

  useEffect(() => {
    localStorage.setItem('salario', salario);
    localStorage.setItem('extra', extra);
    localStorage.setItem('contas', contas);
    localStorage.setItem('diaadia', diaadia);
    localStorage.setItem('guardar', guardar);
  }, [salario, extra, contas, diaadia, guardar]);

  const entrada =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const saida =
    (Number(contas) || 0) +
    (Number(diaadia) || 0) +
    (Number(guardar) || 0);

  const saldo = entrada - saida;

  let status = '🟢 Sobrou dinheiro';
  let cor = '#d1fae5';

  if (saldo < 0) {
    status = '🔴 Gastando mais do que ganha';
    cor = '#fee2e2';
  } else if (saldo <= 300) {
    status = '🟡 Mês apertado';
    cor = '#fef3c7';
  }

  const progresso =
    entrada > 0
      ? Math.min((saida / entrada) * 100, 100)
      : 0;

  const limpar = () => {
    setSalario('');
    setExtra('');
    setContas('');
    setDiaadia('');
    setGuardar('');
    localStorage.clear();
  };

  const campoStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    marginTop: '6px',
    marginBottom: '16px',
    fontSize: '16px'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f3f4f6',
        padding: '20px',
        fontFamily: 'Arial'
      }}
    >
      <div
        style={{
          maxWidth: '430px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '60px',
              marginBottom: '10px'
            }}
          >
            💰
          </div>

          <h1
            style={{
              fontSize: '38px',
              marginBottom: '5px'
            }}
          >
            Meu Salário Organizado
          </h1>

          <p style={{ color: '#666' }}>
            Controle simples do seu dinheiro
          </p>
        </div>

        <div style={{ marginTop: '25px' }}>
          <label>Salário</label>
          <input
            type="number"
            value={salario}
            onChange={(e) =>
              setSalario(e.target.value)
            }
            placeholder="R$ 0"
            style={campoStyle}
          />

          <label>Extra / Bico</label>
          <input
            type="number"
            value={extra}
            onChange={(e) =>
              setExtra(e.target.value)
            }
            placeholder="R$ 0"
            style={campoStyle}
          />

          <label>Contas</label>
          <input
            type="number"
            value={contas}
            onChange={(e) =>
              setContas(e.target.value)
            }
            placeholder="R$ 0"
            style={campoStyle}
          />

          <label>Dia a dia</label>
          <input
            type="number"
            value={diaadia}
            onChange={(e) =>
              setDiaadia(e.target.value)
            }
            placeholder="R$ 0"
            style={campoStyle}
          />

          <label>Guardar</label>
          <input
            type="number"
            value={guardar}
            onChange={(e) =>
              setGuardar(e.target.value)
            }
            placeholder="R$ 0"
            style={campoStyle}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}
          >
            <span>Uso do salário</span>
            <strong>
              {progresso.toFixed(0)}%
            </strong>
          </div>

          <div
            style={{
              width: '100%',
              height: '18px',
              background: '#ddd',
              borderRadius: '999px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progresso}%`,
                height: '100%',
                background: 'black'
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: '25px',
            background: cor,
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '14px' }}>
            STATUS DO MÊS
          </div>

          <h2 style={{ marginTop: '10px' }}>
            {status}
          </h2>

          <h1
            style={{
              fontSize: '42px',
              marginTop: '10px'
            }}
          >
            R$ {saldo.toFixed(2)}
          </h1>
        </div>

        <button
          onClick={limpar}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            background: 'black',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Novo mês
        </button>
      </div>
    </div>
  );
}
