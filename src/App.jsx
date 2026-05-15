export default function App() {
  return (
    <div style={{
      minHeight:'100vh',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      background:'#0f172a',
      color:'white',
      padding:'20px'
    }}>
      <div style={{
        background:'white',
        color:'black',
        borderRadius:'25px',
        padding:'30px',
        width:'100%',
        maxWidth:'350px',
        textAlign:'center'
      }}>
        <div style={{
          fontSize:'50px'
        }}>
          🏠💰✔️
        </div>

        <h1 style={{color:'#1d4ed8'}}>
          Meu Salário
          <span style={{color:'#facc15'}}>
            {" "}Organizado
          </span>
        </h1>

        <p>Simples. Rápido. Sem complicação.</p>

        <button style={{
          background:'#1d4ed8',
          color:'white',
          border:'none',
          padding:'14px',
          borderRadius:'14px',
          width:'100%'
        }}>
          Começar
        </button>
      </div>
    </div>
  )
}
