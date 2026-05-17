import { useState } from 'react'

export default function App() {
  const [salario,setSalario]=useState('')
  const [contas,setContas]=useState('')

  const saldo =
    (Number(salario)||0) -
    (Number(contas)||0)

  return (
    <div style={{padding:20}}>
      <h1>💰 Meu Salário Organizado</h1>

      <input
        type="number"
        placeholder="Salário"
        value={salario}
        onChange={(e)=>setSalario(e.target.value)}
      />

      <br/><br/>

      <input
        type="number"
        placeholder="Contas"
        value={contas}
        onChange={(e)=>setContas(e.target.value)}
      />

      <h2>Saldo: R$ {saldo}</h2>
    </div>
  )
}
