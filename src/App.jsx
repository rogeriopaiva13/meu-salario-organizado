import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, provider } from "./firebase";

export default function App() {
const [loading, setLoading] = useState(true);
const [tela, setTela] = useState("inicio");
const [ocultarValores, setOcultarValores] = useState(false);
const [usuario, setUsuario] = useState(null);

const [nome, setNome] = useState(localStorage.getItem("nome") || "");
const [salario, setSalario] = useState(localStorage.getItem("salario") || "");
const [extra, setExtra] = useState(localStorage.getItem("extra") || "");
const [meta, setMeta] = useState(localStorage.getItem("meta") || "500");

const [nomeGasto, setNomeGasto] = useState("");
const [valorGasto, setValorGasto] = useState("");
const [categoriaGasto, setCategoriaGasto] = useState("Alimentação");

const [nomeConta, setNomeConta] = useState("");
const [valorConta, setValorConta] = useState("");
const [categoriaConta, setCategoriaConta] = useState("Luz");

const [gastos, setGastos] = useState(
JSON.parse(localStorage.getItem("gastos")) || []
);

const [contas, setContas] = useState(
JSON.parse(localStorage.getItem("contasLista")) || []
);

const categorias = {
Alimentação: { icone: "🍔", cor: "#fff3e0", texto: "#e65100" },
Transporte: { icone: "🚗", cor: "#e3f2fd", texto: "#0D47A1" },
Casa: { icone: "🏠", cor: "#fff8e1", texto: "#8a6d00" },
Saúde: { icone: "💊", cor: "#e8f5e9", texto: "#1b5e20" },
Lazer: { icone: "🎮", cor: "#f3e5f5", texto: "#6a1b9a" },
Outros: { icone: "🛒", cor: "#e0f2f1", texto: "#00695c" },
};

const categoriasContas = {
Luz: "💡",
Água: "💧",
Internet: "🌐",
Aluguel: "🏠",
Telefone: "📱",
Outros: "📄",
};

useEffect(() => {
const timer = setTimeout(() => setLoading(false), 1000);
return () => clearTimeout(timer);
}, []);

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (user) => {
if (user) {
setUsuario({
nome: user.displayName,
email: user.email,
foto: user.photoURL,
});
} else {
setUsuario(null);
}
});

return () => unsubscribe();

}, []);

useEffect(() => localStorage.setItem("nome", nome), [nome]);
useEffect(() => localStorage.setItem("salario", salario), [salario]);
useEffect(() => localStorage.setItem("extra", extra), [extra]);
useEffect(() => localStorage.setItem("meta", meta), [meta]);
useEffect(() => localStorage.setItem("gastos", JSON.stringify(gastos)), [gastos]);
useEffect(() => localStorage.setItem("contasLista", JSON.stringify(contas)), [contas]);

const moeda = (valor) => {
if (ocultarValores) return "••••••";
return Number(valor || 0).toLocaleString("pt-BR", {
style: "currency",
currency: "BRL",
});
};

const receitas = (Number(salario) || 0) + (Number(extra) || 0);
const totalGastos = gastos.reduce((acc, item) => acc + Number(item.valor || 0), 0);
const totalContas = contas.reduce((acc, item) => acc + Number(item.valor || 0), 0);
const saidas = totalGastos + totalContas;
const saldo = receitas - saidas - (Number(meta) || 0);
const progresso = receitas > 0 ? Math.min((saidas / receitas) * 100, 100) : 0;

const status =
saldo < 0
? "🔴 Mês no vermelho"
: saldo <= 300
? "🟡 Mês apertado"
: "🟢 Salário sob controle";

const alerta =
progresso >= 100
? "🚨 Você ultrapassou seu limite do mês."
: progresso >= 80
? "⚠️ Atenção! Você já usou mais de 80%."
: saldo <= 0
? "🔴 Seu saldo livre ficou negativo."
: "🟢 Continue assim! Seu mês está saudável.";

async function loginGoogle() {
try {
await signInWithPopup(auth, provider);
} catch (error) {
console.error(error);
alert("Não foi possível entrar com Google.");
}
}

async function logoutGoogle() {
try {
await signOut(auth);
} catch (error) {
console.error(error);
alert("Erro ao sair da conta.");
}
}

async function adicionarGasto() {
if (!nomeGasto || !valorGasto) return;

const novo = {  
  nome: nomeGasto,  
  valor: Number(valorGasto),  
  categoria: categoriaGasto,  
};  

setGastos([...gastos, novo]);  

try {  
  await addDoc(collection(db, "gastos"), {  
    ...novo,  
    usuario: usuario?.nome || nome || "Usuário",  
    email: usuario?.email || "",  
    criadoEm: serverTimestamp(),  
  });  
} catch (error) {  
  console.error(error);  
  alert("Gasto salvo no celular, mas não foi para a nuvem.");  
}  

setNomeGasto("");  
setValorGasto("");

}

function adicionarConta() {
if (!nomeConta || !valorConta) return;

setContas([  
  ...contas,  
  {  
    nome: nomeConta,  
    valor: Number(valorConta),  
    categoria: categoriaConta,  
  },  
]);  

setNomeConta("");  
setValorConta("");

}

function removerGasto(index) {
setGastos(gastos.filter((_, i) => i !== index));
}

function removerConta(index) {
setContas(contas.filter((_, i) => i !== index));
}

const inputStyle = {
width: "100%",
padding: "15px",
borderRadius: "18px",
border: "1px solid #d9e2f3",
fontSize: "16px",
boxSizing: "border-box",
outline: "none",
background: "#f9fbff",
};

const card = {
background: "white",
padding: "22px",
borderRadius: "28px",
marginBottom: "18px",
boxShadow: "0 10px 30px rgba(13,71,161,0.10)",
};

const navItem = (id, icon, label) => (
<button
onClick={() => setTela(id)}
style={{
border: "none",
background: tela === id ? "#e8f1ff" : "transparent",
color: tela === id ? "#0D47A1" : "#7b8794",
borderRadius: "18px",
padding: "8px 9px",
minWidth: "56px",
fontWeight: "bold",
fontSize: "11px",
boxShadow: tela === id ? "0 6px 14px rgba(13,71,161,0.12)" : "none",
}}
>
<div style={{ fontSize: "20px", lineHeight: "20px" }}>{icon}</div>
<div>{label}</div>
</button>
);

if (loading) {
return (
<div
style={{
background: "linear-gradient(180deg,#0D47A1,#06306f)",
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
color: "white",
fontFamily: "Arial",
}}
>
<div style={{ textAlign: "center" }}>
<img src="/logo.png" alt="logo" style={{ width: "120px" }} />
<h1>Meu Salário Organizado</h1>
<p style={{ color: "#FDD835" }}>Organize hoje, realize amanhã</p>
</div>
</div>
);
}

return (
<div
style={{
background: "#eef3fb",
minHeight: "100vh",
paddingBottom: "120px",
fontFamily: "Arial",
}}
>
<div
style={{
background: "linear-gradient(180deg,#0D47A1,#063B88)",
color: "white",
padding: "28px 22px 34px",
borderBottomLeftRadius: "38px",
borderBottomRightRadius: "38px",
}}
>
<img
src="/logo-horizontal.png"
alt="logo"
style={{ width: "220px", display: "block", margin: "0 auto 22px" }}
/>

<h2 style={{ fontSize: "30px", margin: 0 }}>  
      👋 Olá{usuario?.nome ? `, ${usuario.nome}` : nome ? `, ${nome}` : ""}!  
    </h2>  

    <p style={{ fontSize: "17px", opacity: 0.9 }}>Vamos organizar seu mês?</p>  

    <button  
      onClick={() => setOcultarValores(!ocultarValores)}  
      style={{  
        padding: "10px 14px",  
        borderRadius: "14px",  
        border: "none",  
        background: "rgba(255,255,255,0.18)",  
        color: "white",  
        fontWeight: "bold",  
      }}  
    >  
      {ocultarValores ? "👁 Mostrar" : "🙈 Ocultar"}  
    </button>  

    {!usuario ? (  
      <button  
        onClick={loginGoogle}  
        style={{  
          marginTop: "14px",  
          width: "100%",  
          padding: "14px",  
          borderRadius: "16px",  
          border: "none",  
          background: "white",  
          color: "#0D47A1",  
          fontWeight: "bold",  
          fontSize: "15px",  
        }}  
      >  
        🔐 Entrar com Google  
      </button>  
    ) : (  
      <div  
        style={{  
          marginTop: "14px",  
          background: "rgba(255,255,255,0.18)",  
          padding: "12px",  
          borderRadius: "18px",  
          display: "flex",  
          alignItems: "center",  
          gap: "10px",  
        }}  
      >  
        {usuario.foto && (  
          <img  
            src={usuario.foto}  
            alt="foto"  
            style={{ width: "38px", height: "38px", borderRadius: "50%" }}  
          />  
        )}  

        <div style={{ flex: 1 }}>  
          <p style={{ margin: 0, fontWeight: "bold" }}>{usuario.nome}</p>  
          <p style={{ margin: "3px 0 0", fontSize: "12px" }}>{usuario.email}</p>  
        </div>  

        <button  
          onClick={logoutGoogle}  
          style={{  
            border: "none",  
            background: "#d32f2f",  
            color: "white",  
            padding: "8px 10px",  
            borderRadius: "10px",  
            fontWeight: "bold",  
          }}  
        >  
          Sair  
        </button>  
      </div>  
    )}  

    <div  
      style={{  
        background: "rgba(255,255,255,0.14)",  
        borderRadius: "24px",  
        padding: "18px",  
        marginTop: "22px",  
      }}  
    >  
      <p style={{ fontSize: "15px", margin: 0 }}>Saldo livre após meta</p>  

      <h1 style={{ color: "#FDD835", fontSize: "42px", margin: "14px 0" }}>  
        {moeda(saldo)}  
      </h1>  

      <p style={{ fontSize: "20px", margin: 0 }}>{status}</p>  

      <p style={{ marginTop: "12px", fontSize: "14px", opacity: 0.95 }}>  
        {alerta}  
      </p>  
    </div>  
  </div>  

  {tela === "inicio" && (  
    <div style={{ padding: "20px", marginTop: "-10px" }}>  
      <div style={card}>  
        <h2>📊 Resumo</h2>  
        <p>Entradas: <strong>{moeda(receitas)}</strong></p>  
        <p>Saídas: <strong>{moeda(saidas)}</strong></p>  
        <p>Meta reservada: <strong>{moeda(meta)}</strong></p>  
        <p>Uso do salário: <strong>{progresso.toFixed(0)}%</strong></p>  
      </div>  
    </div>  
  )}  

  {tela === "entradas" && (  
    <div style={{ padding: "20px" }}>  
      <div style={card}>  
        <h2>💰 Entradas</h2>  

        <p>Salário</p>  
        <input  
          style={inputStyle}  
          value={ocultarValores ? "•••••" : salario}  
          onChange={(e) => setSalario(e.target.value)}  
          inputMode="decimal"  
        />  

        <div style={{ height: "14px" }} />  

        <p>Extra</p>  
        <input  
          style={inputStyle}  
          value={ocultarValores ? "•••••" : extra}  
          onChange={(e) => setExtra(e.target.value)}  
          inputMode="decimal"  
        />  
      </div>  
    </div>  
  )}  

  {tela === "gastos" && (  
    <div style={{ padding: "20px" }}>  
      <div style={card}>  
        <h2>💸 Gastos</h2>  

        <input  
          style={inputStyle}  
          placeholder="Nome do gasto"  
          value={nomeGasto}  
          onChange={(e) => setNomeGasto(e.target.value)}  
        />  

        <div style={{ height: "12px" }} />  

        <input  
          style={inputStyle}  
          type="number"  
          placeholder="Valor"  
          value={valorGasto}  
          onChange={(e) => setValorGasto(e.target.value)}  
        />  

        <div style={{ height: "12px" }} />  

        <select  
          style={inputStyle}  
          value={categoriaGasto}  
          onChange={(e) => setCategoriaGasto(e.target.value)}  
        >  
          {Object.keys(categorias).map((cat) => (  
            <option key={cat} value={cat}>  
              {categorias[cat].icone} {cat}  
            </option>  
          ))}  
        </select>  

        <div style={{ height: "16px" }} />  

        <button  
          onClick={adicionarGasto}  
          style={{  
            width: "100%",  
            padding: "16px",  
            borderRadius: "18px",  
            border: "none",  
            background: "#0D47A1",  
            color: "white",  
            fontWeight: "bold",  
          }}  
        >  
          ➕ Adicionar gasto  
        </button>  
      </div>  

      {gastos.map((item, index) => {  
        const cat = categorias[item.categoria] || categorias.Outros;  

        return (  
          <div key={index} style={card}>  
            <span  
              style={{  
                background: cat.cor,  
                color: cat.texto,  
                padding: "6px 12px",  
                borderRadius: "999px",  
                fontWeight: "bold",  
                fontSize: "13px",  
              }}  
            >  
              {cat.icone} {item.categoria}  
            </span>  

            <h3>{item.nome}</h3>  
            <p><strong>{moeda(item.valor)}</strong></p>  

            <button onClick={() => removerGasto(index)}>Excluir</button>  
          </div>  
        );  
      })}  
    </div>  
  )}  

  {tela === "contas" && (  
    <div style={{ padding: "20px" }}>  
      <div style={card}>  
        <h2>📄 Contas Fixas</h2>  

        <input  
          style={inputStyle}  
          placeholder="Nome da conta"  
          value={nomeConta}  
          onChange={(e) => setNomeConta(e.target.value)}  
        />  

        <div style={{ height: "12px" }} />  

        <input  
          style={inputStyle}  
          type="number"  
          placeholder="Valor"  
          value={valorConta}  
          onChange={(e) => setValorConta(e.target.value)}  
        />  

        <div style={{ height: "12px" }} />  

        <select  
          style={inputStyle}  
          value={categoriaConta}  
          onChange={(e) => setCategoriaConta(e.target.value)}  
        >  
          {Object.keys(categoriasContas).map((cat) => (  
            <option key={cat} value={cat}>  
              {categoriasContas[cat]} {cat}  
            </option>  
          ))}  
        </select>  

        <div style={{ height: "16px" }} />  

        <button  
          onClick={adicionarConta}  
          style={{  
            width: "100%",  
            padding: "16px",  
            borderRadius: "18px",  
            border: "none",  
            background: "#0D47A1",  
            color: "white",  
            fontWeight: "bold",  
          }}  
        >  
          ➕ Adicionar conta  
        </button>  
      </div>  

      {contas.map((item, index) => (  
        <div key={index} style={card}>  
          <h3>{categoriasContas[item.categoria]} {item.nome}</h3>  
          <p><strong>{moeda(item.valor)}</strong></p>  
          <button onClick={() => removerConta(index)}>Excluir</button>  
        </div>  
      ))}  
    </div>  
  )}  

  {tela === "metas" && (  
    <div style={{ padding: "20px" }}>  
      <div style={card}>  
        <h2>🎯 Meta do mês</h2>  

        <input  
          style={inputStyle}  
          value={ocultarValores ? "•••••" : meta}  
          onChange={(e) => setMeta(e.target.value)}  
          inputMode="decimal"  
        />  
      </div>  
    </div>  
  )}  

  {tela === "perfil" && (  
    <div style={{ padding: "20px" }}>  
      <div style={card}>  
        <h2>👤 Perfil</h2>  

        <input  
          style={inputStyle}  
          value={nome}  
          onChange={(e) => setNome(e.target.value)}  
          placeholder="Digite seu nome"  
        />  
      </div>  
    </div>  
  )}  

  <div  
    style={{  
      position: "fixed",  
      bottom: "12px",  
      left: "10px",  
      right: "10px",  
      background: "rgba(255,255,255,0.96)",  
      display: "flex",  
      justifyContent: "space-between",  
      alignItems: "center",  
      padding: "8px",  
      borderRadius: "26px",  
      boxShadow: "0 -8px 30px rgba(0,0,0,0.12)",  
      border: "1px solid #e5eaf3",  
      zIndex: 999,  
      backdropFilter: "blur(10px)",  
    }}  
  >  
    {navItem("inicio", "🏠", "Início")}  
    {navItem("entradas", "💰", "Entrada")}  
    {navItem("gastos", "💸", "Gastos")}  
    {navItem("contas", "📄", "Contas")}  
    {navItem("metas", "🎯", "Metas")}  
    {navItem("perfil", "👤", "Perfil")}  
  </div>  
</div>

);
}
