import React, { useState, useEffect } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");

  const [salario, setSalario] = useState(
    localStorage.getItem("salario") || ""
  );

  const [extra, setExtra] = useState(
    localStorage.getItem("extra") || ""
  );

  const [contas, setContas] = useState(
    localStorage.getItem("contas") || ""
  );

  const [meta, setMeta] = useState(
    localStorage.getItem("meta") || "500"
  );

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");

  const [gastos, setGastos] = useState(
    JSON.parse(
      localStorage.getItem("gastos")
    ) || []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "salario",
      salario
    );
  }, [salario]);

  useEffect(() => {
    localStorage.setItem(
      "extra",
      extra
    );
  }, [extra]);

  useEffect(() => {
    localStorage.setItem(
      "contas",
      contas
    );
  }, [contas]);

  useEffect(() => {
    localStorage.setItem(
      "meta",
      meta
    );
  }, [meta]);

  useEffect(() => {
    localStorage.setItem(
      "gastos",
      JSON.stringify(gastos)
    );
  }, [gastos]);

  const receitas =
    (Number(salario)||0)+
    (Number(extra)||0);

  const totalGastos =
    gastos.reduce(
      (acc,item)=>
      acc+item.valor,
      0
    );

  const saldo =
    receitas -
    (Number(contas)||0) -
    totalGastos;

  function adicionarGasto() {

    if(
      !nomeGasto ||
      !valorGasto
    ) return;

    setGastos([
      ...gastos,
      {
        nome:nomeGasto,
        valor:Number(valorGasto)
      }
    ]);

    setNomeGasto("");
    setValorGasto("");
  }

  if(loading){
    return(
      <div style={{
        background:"#0D47A1",
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        color:"white"
      }}>
        <div style={{
          textAlign:"center"
        }}>
          <img
            src="/logo.png"
            style={{
              width:"120px"
            }}
          />

          <h1>
            Meu Salário Organizado
          </h1>

        </div>
      </div>
    )
  }

  return(
    <div style={{
      background:"#f5f7fb",
      minHeight:"100vh",
      paddingBottom:"90px",
      fontFamily:"Arial"
    }}>

      <div style={{
        background:"#0D47A1",
        color:"white",
        padding:"25px",
        borderBottomLeftRadius:"30px",
        borderBottomRightRadius:"30px"
      }}>

      <img
        src="/logo-horizontal.png"
        style={{
          width:"220px",
          display:"block",
          margin:"0 auto"
        }}
      />

      <h2>
        👋 Olá Rogério
      </h2>

      </div>

      <div style={{
        padding:"15px"
      }}>

      {tela==="inicio"&&(
      <>

      <div style={{
        background:"white",
        padding:"20px",
        borderRadius:"20px",
        marginBottom:"15px"
      }}>
      <h3>🎯 Meta</h3>

      <input
      value={meta}
      onChange={(e)=>
      setMeta(
      e.target.value
      )}
      />

      <p>
      Guardar:
      R$ {meta}
      </p>

      </div>

      <div style={{
      background:"white",
      padding:"20px",
      borderRadius:"20px"
      }}>

      <input
      placeholder="Salário"
      value={salario}
      onChange={(e)=>
      setSalario(
      e.target.value
      )}
      />

      <br/><br/>

      <input
      placeholder="Extra"
      value={extra}
      onChange={(e)=>
      setExtra(
      e.target.value
      )}
      />

      <br/><br/>

      <input
      placeholder="Contas"
      value={contas}
      onChange={(e)=>
      setContas(
      e.target.value
      )}
      />

      <h2>
      💰 R$ {saldo.toFixed(2)}
      </h2>

      </div>

      </>
      )}

      {tela==="gastos"&&(
      <div style={{
      background:"white",
      padding:"20px",
      borderRadius:"20px"
      }}>

      <input
      placeholder="Nome"
      value={nomeGasto}
      onChange={(e)=>
      setNomeGasto(
      e.target.value
      )}
      />

      <br/><br/>

      <input
      placeholder="Valor"
      value={valorGasto}
      onChange={(e)=>
      setValorGasto(
      e.target.value
      )}
      />

      <br/><br/>

      <button
      onClick={
      adicionarGasto
      }>
      Adicionar
      </button>

      <hr/>

      {gastos.map(
      (item,index)=>(
      <p key={index}>
      {item.nome}
      - R$ {item.valor}
      </p>
      ))}

      </div>
      )}

      </div>

      <div style={{
      position:"fixed",
      bottom:0,
      width:"100%",
      background:"white",
      display:"flex",
      justifyContent:"space-around",
      padding:"12px"
      }}>

      <div onClick={()=>
      setTela(
      "inicio"
      )}>
      🏠
      </div>

      <div onClick={()=>
      setTela(
      "gastos"
      )}>
      💸
      </div>

      </div>

    </div>
  )
          }
