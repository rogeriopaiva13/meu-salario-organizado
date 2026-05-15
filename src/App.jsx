import { useState } from 'react'

export default function App() {
  const [salario,setSalario]=useState('')
  const [contas,setContas]=useState('')

  const saldo =
    Number(salario)-Number(contas)

  return(
    <div style={{
      maxWidth:'400px',
      margin:'20px auto',
      padding:'20px'
    }}>
      <h1>💰 Meu Salário Organizado</h1>

      <input
      placeholder="Salário"
      value={salario}
      onChange={(e)=>setSalario(e.target.value)}
      />

      <br/><br/>

      <input
      placeholder="Contas"
      value={contas}
      onChange={(e)=>setContas(e.target.value)}
      />

      <h2>
      Saldo: R$ {saldo}
      </h2>
    </div>
  )
}
