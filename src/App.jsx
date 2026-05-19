import React, { useState, useEffect } from "react"; import { collection, addDoc, serverTimestamp } from "firebase/firestore"; import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"; import { db, auth, provider } from "./firebase";

export default function App() { const [loading, setLoading] = useState(true); const [tela, setTela] = useState("inicio"); const [ocultarValores, setOcultarValores] = useState(false); const [usuario, setUsuario] = useState(null);

const [nome, setNome] = useState(localStorage.getItem("nome") || ""); const [salario, setSalario] = useState(localStorage.getItem("salario") || ""); const [extra, setExtra] = useState(localStorage.getItem("extra") || ""); const [meta, setMeta] = useState(localStorage.getItem("meta") || "500");

const [nomeGasto, setNomeGasto] = useState(""); const [valorGasto, setValorGasto] = useState(""); const [categoriaGasto, setCategoriaGasto] = useState("Alimentação");

const [nomeConta, setNomeConta] = useState(""); const [valorConta, setValorConta] = useState(""); const [categoriaConta, setCategoriaConta] = useState("Luz");

const [gastos, setGastos] = useState( JSON.parse(localStorage.getItem("gastos")) || [] );

const [contas, setContas] = useState( JSON.parse(localStorage.getItem("contasLista")) || [] );

const categorias = { Alimentação: { icone: "🍔", cor: "#fff3e0", texto: "#e65100" }, Transporte: { icone: "🚗", cor: "#e3f2fd", texto: "#0D47A1" }, Casa: { icone: "🏠", cor: "#fff8e1", texto: "#8a6d00" }, Saúde: { icone: "💊", cor: "#e8f5e9", texto: "#1b5e20" }, Lazer: { icone: "🎮", cor: "#f3e5f5", texto: "#6a1b9a" }, Outros: { icone: "🛒", cor: "#e0f2f1", texto: "#00695c" }, };

const categoriasContas = { Luz: "💡", Água: "💧", Internet: "🌐", Aluguel: "🏠", Telefone: "📱", Outros: "📄", };

useEffect(() => { const timer = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(timer); }, []);

useEffect(() => { const unsubscribe = onAuthStateChanged(auth, (user) => { if (user) { setUsuario({ nome: user.displayName, email: user.email, foto: user.photoURL, }); } else { setUsuario(null); } });

return () => unsubscribe();

}, []);

useEffect(() => localStorage.setItem("nome", nome), [nome]); useEffect(() => localStorage.setItem("salario", salario), [salario]); useEffect(() => localStorage.setItem("extra", extra), [extra]); useEffect(() => localStorage.setItem("meta", meta), [meta]); useEffect(() => localStorage.setItem("gastos", JSON.stringify(gastos)), [gastos]); useEffect(() => localStorage.setItem("contasLista", JSON.stringify(contas)), [contas]);

const moeda = (valor) => { if (ocultarValores) return "••••••"; return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", }); };

const hoje = new Date().toLocaleDateString("pt-BR"); const receitas = (Number(salario) || 0) + (Number(extra) || 0); const totalGastos = gastos.reduce((acc, item) => acc + Number(item.valor || 0), 0); const totalGastosHoje = gastos .filter((item) => item.data === hoje || !item.data) .reduce((acc, item) => acc + Number(item.valor || 0), 0); const totalContas = contas.reduce((acc, item) => acc + Number(item.valor || 0), 0); const saidas = totalGastos + totalContas; const saldo = receitas - saidas - (Number(meta) || 0); const progresso = receitas > 0 ? Math.min((saidas / receitas) * 100, 100) : 0;

const status = saldo < 0 ? "🔴 Mês no vermelho" : saldo <= 300 ? "🟡 Mês apertado" : "🟢 Salário sob controle";

const alerta = progresso >= 100 ? "🚨 Você ultrapassou seu limite do mês." : progresso >= 80 ? "⚠️ Atenção! Você já usou mais de 80%." : saldo <= 0 ? "🔴 Seu saldo livre ficou negativo." : "🟢 Continue assim! Seu mês está saudável.";

const gastosPorCategoria = gastos.reduce((acc, item) => { const categoria = item.categoria || "Outros"; acc[categoria] = (acc[categoria] || 0) + Number(item.valor || 0); return acc; }, {});

const maiorGastoCategoria = Math.max(...Object.values(gastosPorCategoria), 1);

async function loginGoogle() { try { await signInWithPopup(auth, provider); } catch (error) { console.error(error); alert("Não foi possível entrar com Google."); } }

async function logoutGoogle() { try { await signOut(auth); } catch (error) { console.error(error); alert("Erro ao sair da conta."); } }

async function adicionarGasto() { if (!nomeGasto || !valorGasto) return;

const agora = new Date();

const novo = {
  nome: nomeGasto,
  valor: Number(valorGasto),
  categoria: categoriaGasto,
  data: agora.toLocaleDateString("pt-BR"),
  hora: agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }),
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

function adicionarConta() { if (!nomeConta || !valorConta) return;

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

function removerGasto(index) { setGastos(gastos.filter((_, i) => i !== index)); }

function removerConta(index) { setContas(contas.filter((_, i) => i !== index)); }

const inputStyle = { width: "100%", padding: "15px", borderRadius: "18px", border: "1px solid #d9e2f3", fontSize: "16px", boxSizing: "border-box", outline: "none", background: "#f9fbff", };

const card = { background: "white", padding: "22px", borderRadius: "28px", marginBottom: "18px", boxShadow: "0 10px 30px rgba(13,71,161,0.10)", };

const navItem = (id, icon, label) => ( <button onClick={() => setTela(id)} style={{ border: "none", background: tela === id ? "#e8f1ff" : "transparent", color: tela === id ? "#0D47A1" : "#7b8794", borderRadius: "18px", padding: "8px 7px", minWidth: "48px", fontWeight: "bold", fontSize: "10px", boxShadow: tela === id ? "0 6px 14px rgba(13,71,161,0.12)" : "none", }} > <div style={{ fontSize: "19px", lineHeight: "20px" }}>{icon}</div> <div>{label}</div> </button> );

if (loading) { return ( <div style={{ background: "linear-gradient(180deg,#0D47A1,#06306f)", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontFamily: "Arial", }} > <div style={{ textAlign: "center" }}> <img src="/logo.png" alt="logo" style={{ width: "120px" }} /> <h1>Meu Salário Organizado</h1> <p style={{ color: "#FDD835" }}>Organize hoje, realize amanhã</p> </div> </div> ); }

return ( <div style={{ background: "#eef3fb", minHeight: "100vh", paddingBottom: "125px", fontFamily: "Arial", }} > <div style={{ background: "linear-gradient(180deg,#0D47A1,#063B88)", color: "white", padding: "28px 22px 34px", borderBottomLeftRadius: "38px", borderBottomRightRadius: "38px", }} > <img src="/logo-horizontal.png" alt="logo" style={{ width: "220px", display: "block", margin: "0 auto 22px" }} />

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
    <div style={{ padding: "20px", marginTop: "-12px" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#ffffff,#f4f8ff)",
          borderRadius: "30px",
          padding: "24px",
          marginBottom: "18px",
          boxShadow: "0 18px 40px rgba(13,71,161,0.10)",
          border: "1px solid #edf2ff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
              Resumo inteligente
            </p>

            <h1 style={{ margin: "8px 0 0", fontSize: "36px", color: "#0D47A1" }}>
              {moeda(saldo)}
            </h1>
          </div>

          <div
            style={{
              width: "78px",
              height: "78px",
              borderRadius: "50%",
              background:
                progresso > 80
                  ? "linear-gradient(135deg,#ff6b6b,#d32f2f)"
                  : "linear-gradient(135deg,#FDD835,#fbc02d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1f2937",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.10)",
            }}
          >
            {progresso.toFixed(0)}%
          </div>
        </div>

        <div
          style={{
            background: "#edf4ff",
            borderRadius: "999px",
            height: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progresso}%`,
              height: "16px",
              borderRadius: "999px",
              background:
                progresso > 80
                  ? "linear-gradient(90deg,#ff6b6b,#d32f2f)"
                  : "linear-gradient(90deg,#0D47A1,#42a5f5)",
              transition: "0.4s",
            }}
          />
        </div>

        <p style={{ marginTop: "14px", marginBottom: 0, color: "#374151", lineHeight: "22px" }}>
          {alerta}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={miniCardStyle}>
          <p style={miniLabelStyle}>Entradas</p>
          <h3 style={{ ...miniValueStyle, color: "#1b5e20" }}>{moeda(receitas)}</h3>
        </div>

        <div style={miniCardStyle}>
          <p style={miniLabelStyle}>Saídas</p>
          <h3 style={{ ...miniValueStyle, color: "#c62828" }}>{moeda(saidas)}</h3>
        </div>

        <div style={miniCardStyle}>
          <p style={miniLabelStyle}>Meta</p>
          <h3 style={{ ...miniValueStyle, color: "#0D47A1" }}>{moeda(meta)}</h3>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#0D47A1,#1565C0)",
            borderRadius: "24px",
            padding: "18px",
            color: "white",
            boxShadow: "0 12px 28px rgba(13,71,161,0.25)",
          }}
        >
          <p style={{ margin: 0, opacity: 0.85, fontSize: "13px" }}>Hoje</p>
          <h3 style={{ margin: "10px 0 0", fontSize: "22px" }}>{moeda(totalGastosHoje)}</h3>
        </div>
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
          style={primaryButtonStyle}
        >
          ➕ Adicionar gasto
        </button>
      </div>

      <div style={card}>
        <h2>📊 Onde você mais gasta</h2>

        {Object.keys(gastosPorCategoria).length === 0 && (
          <p>Adicione gastos para visualizar o gráfico.</p>
        )}

        {Object.entries(gastosPorCategoria).map(([categoria, valor]) => {
          const cat = categorias[categoria] || categorias.Outros;
          const largura = (valor / maiorGastoCategoria) * 100;

          return (
            <div key={categoria} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <strong>{cat.icone} {categoria}</strong>
                <strong>{moeda(valor)}</strong>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "16px",
                  background: "#eceff1",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${largura}%`,
                    height: "16px",
                    background: cat.texto,
                    borderRadius: "20px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {gastos.map((item, index) => {
        const cat = categorias[item.categoria] || categorias.Outros;

        return (
          <div key={index} style={card}>
            <span style={badgeStyle(cat)}>
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

  {tela === "diario" && (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#0D47A1,#1976D2)",
          borderRadius: "28px",
          padding: "24px",
          color: "white",
          marginBottom: "18px",
          boxShadow: "0 18px 40px rgba(13,71,161,0.22)",
        }}
      >
        <p style={{ margin: 0, opacity: 0.9 }}>Gastos de hoje</p>
        <h1 style={{ margin: "10px 0", fontSize: "42px" }}>{moeda(totalGastosHoje)}</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Continue acompanhando seus hábitos 💙</p>
      </div>

      {gastos.length === 0 && (
        <div style={card}>
          <p>Nenhum gasto registrado ainda.</p>
        </div>
      )}

      {gastos.map((item, index) => {
        const cat = categorias[item.categoria] || categorias.Outros;

        return (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "18px",
              marginBottom: "14px",
              boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                  {cat.icone} {item.categoria}
                </p>
                <h3 style={{ margin: "6px 0" }}>{item.nome}</h3>
                <strong style={{ color: cat.texto }}>{moeda(item.valor)}</strong>
              </div>

              <div
                style={{
                  background: "#f3f7ff",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  fontSize: "12px",
                  color: "#0D47A1",
                  fontWeight: "bold",
                }}
              >
                {item.hora || "Hoje"}
              </div>
            </div>
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

        <button onClick={adicionarConta} style={primaryButtonStyle}>
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
       : "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
              Resumo inteligente
            </p>

            <h1 style={{ margin: "8px 0 0", fontSize: "36px", color: "#0D47A1" }}>
              {moeda(saldo)}
            </h1>
          </div>

          <div
            style={{
              width: "78px",
              height: "78px",
              borderRadius: "50%",
              background:
                progresso > 80
                  ? "linear-gradient(135deg,#ff6b6b,#d32f2f)"
                  : "linear-gradient(135deg,#FDD835,#fbc02d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1f2937",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.10)",
            }}
          >
            {progresso.toFixed(0)}%
          </div>
        </div>

        <div
          style={{
            background: "#edf4ff",
            borderRadius: "999px",
            height: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progresso}%`,
              height: "16px",
              borderRadius: "999px",
              background:
                progresso > 80
                  ? "linear-gradient(90deg,#ff6b6b,#d32f2f)"
                  : "linear-gradient(90deg,#0D47A1,#42a5f5)",
              transition: "0.4s",
            }}
          />
        </div>

        <p style={{ marginTop: "14px", marginBottom: 0, color: "#374151", lineHeight: "22px" }}>
          {alerta}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={miniCardStyle}>
          <p style={miniLabelStyle}>Entradas</p>
          <h3 style={{ ...miniValueStyle, color: "#1b5e20" }}>{moeda(receitas)}</h3>
        </div>

        <div style={miniCardStyle}>
          <p style={miniLabelStyle}>Saídas</p>
          <h3 style={{ ...miniValueStyle, color: "#c62828" }}>{moeda(saidas)}</h3>
        </div>

        <div style={miniCardStyle}>
          <p style={miniLabelStyle}>Meta</p>
          <h3 style={{ ...miniValueStyle, color: "#0D47A1" }}>{moeda(meta)}</h3>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#0D47A1,#1565C0)",
            borderRadius: "24px",
            padding: "18px",
            color: "white",
            boxShadow: "0 12px 28px rgba(13,71,161,0.25)",
          }}
        >
          <p style={{ margin: 0, opacity: 0.85, fontSize: "13px" }}>Hoje</p>
          <h3 style={{ margin: "10px 0 0", fontSize: "22px" }}>{moeda(totalGastosHoje)}</h3>
        </div>
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
          style={primaryButtonStyle}
        >
          ➕ Adicionar gasto
        </button>
      </div>

      <div style={card}>
        <h2>📊 Onde você mais gasta</h2>

        {Object.keys(gastosPorCategoria).length === 0 && (
          <p>Adicione gastos para visualizar o gráfico.</p>
        )}

        {Object.entries(gastosPorCategoria).map(([categoria, valor]) => {
          const cat = categorias[categoria] || categorias.Outros;
          const largura = (valor / maiorGastoCategoria) * 100;

          return (
            <div key={categoria} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <strong>{cat.icone} {categoria}</strong>
                <strong>{moeda(valor)}</strong>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "16px",
                  background: "#eceff1",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${largura}%`,
                    height: "16px",
                    background: cat.texto,
                    borderRadius: "20px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {gastos.map((item, index) => {
        const cat = categorias[item.categoria] || categorias.Outros;

        return (
          <div key={index} style={card}>
            <span style={badgeStyle(cat)}>
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

  {tela === "diario" && (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#0D47A1,#1976D2)",
          borderRadius: "28px",
          padding: "24px",
          color: "white",
          marginBottom: "18px",
          boxShadow: "0 18px 40px rgba(13,71,161,0.22)",
        }}
      >
        <p style={{ margin: 0, opacity: 0.9 }}>Gastos de hoje</p>
        <h1 style={{ margin: "10px 0", fontSize: "42px" }}>{moeda(totalGastosHoje)}</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Continue acompanhando seus hábitos 💙</p>
      </div>

      {gastos.length === 0 && (
        <div style={card}>
          <p>Nenhum gasto registrado ainda.</p>
        </div>
      )}

      {gastos.map((item, index) => {
        const cat = categorias[item.categoria] || categorias.Outros;

        return (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "18px",
              marginBottom: "14px",
              boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                  {cat.icone} {item.categoria}
                </p>
                <h3 style={{ margin: "6px 0" }}>{item.nome}</h3>
                <strong style={{ color: cat.texto }}>{moeda(item.valor)}</strong>
              </div>

              <div
                style={{
                  background: "#f3f7ff",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  fontSize: "12px",
                  color: "#0D47A1",
                  fontWeight: "bold",
                }}
              >
                {item.hora || "Hoje"}
              </div>
            </div>
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

        <button onClick={adicionarConta} style={primaryButtonStyle}>
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
       
