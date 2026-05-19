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

  const [historico, setHistorico] = useState(
    JSON.parse(localStorage.getItem("historico")) || []
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

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem("contasLista", JSON.stringify(contas));
  }, [contas]);

  useEffect(() => {
    localStorage.setItem("historico", JSON.stringify(historico));
  }, [historico]);

  const moeda = (valor) => {
    if (ocultarValores) return "••••••";

    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const receitas =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const totalGastos = gastos.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0
  );

  const totalContas = contas.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0
  );

  const saidas = totalGastos + totalContas;

  const saldo =
    receitas -
    saidas -
    (Number(meta) || 0);

  const progresso =
    receitas > 0
      ? Math.min((saidas / receitas) * 100, 100)
      : 0;

  const status =
    saldo < 0
      ? "🔴 Mês no vermelho"
      : saldo <= 300
      ? "🟡 Mês apertado"
      : "🟢 Salário sob controle";

  async function loginGoogle() {
    try {
      const resultado = await signInWithPopup(
        auth,
        provider
      );

      setUsuario({
        nome: resultado.user.displayName,
        email: resultado.user.email,
        foto: resultado.user.photoURL,
      });
    } catch (error) {
      console.error(error);
      alert("Erro no login.");
    }
  }

  async function logoutGoogle() {
    await signOut(auth);
    setUsuario(null);
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
    boxShadow:
      "0 10px 30px rgba(13,71,161,0.10)",
  };

  if (loading) {
    return (
      <div
        style={{
          background:
            "linear-gradient(180deg,#0D47A1,#06306f)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <h1>Meu Salário Organizado</h1>
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
          background:
            "linear-gradient(180deg,#0D47A1,#063B88)",
          color: "white",
          padding: "28px 22px 34px",
          borderBottomLeftRadius: "38px",
          borderBottomRightRadius: "38px",
        }}
      >
        <h2>
          👋 Olá
          {usuario?.nome
            ? `, ${usuario.nome}`
            : nome
            ? `, ${nome}`
            : ""}
          !
        </h2>

        <button
          onClick={() =>
            setOcultarValores(!ocultarValores)
          }
          style={{
            marginTop: "12px",
            padding: "10px 14px",
            borderRadius: "14px",
            border: "none",
          }}
        >
          {ocultarValores
            ? "👁 Mostrar"
            : "🙈 Ocultar"}
        </button>

        {!usuario ? (
          <button
            onClick={loginGoogle}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              border: "none",
            }}
          >
            🔐 Entrar com Google
          </button>
        ) : (
          <button
            onClick={logoutGoogle}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              border: "none",
              background: "#d32f2f",
              color: "white",
            }}
          >
            Sair
          </button>
        )}

        <div
          style={{
            background:
              "rgba(255,255,255,0.14)",
            borderRadius: "24px",
            padding: "18px",
            marginTop: "22px",
          }}
        >
          <p>Saldo livre após meta</p>

          <h1>{moeda(saldo)}</h1>

          <p>{status}</p>
        </div>
      </div>

      {tela === "inicio" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>📊 Resumo</h2>

            <p>Entradas: {moeda(receitas)}</p>

            <p>Saídas: {moeda(saidas)}</p>

            <p>Meta: {moeda(meta)}</p>

            <p>Uso: {progresso.toFixed(0)}%</p>
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
              value={salario}
              onChange={(e) =>
                setSalario(e.target.value)
              }
            />

            <div style={{ height: "14px" }} />

            <p>Extra</p>

            <input
              style={inputStyle}
              value={extra}
              onChange={(e) =>
                setExtra(e.target.value)
              }
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
              placeholder="Nome"
              value={nomeGasto}
              onChange={(e) =>
                setNomeGasto(e.target.value)
              }
            />

            <div style={{ height: "12px" }} />

            <input
              style={inputStyle}
              type="number"
              placeholder="Valor"
              value={valorGasto}
              onChange={(e) =>
                setValorGasto(e.target.value)
              }
            />

            <div style={{ height: "12px" }} />

            <select
              style={inputStyle}
              value={categoriaGasto}
              onChange={(e) =>
                setCategoriaGasto(e.target.value)
              }
            >
              {Object.keys(categorias).map(
                (cat) => (
                  <option key={cat}>
                    {categorias[cat].icone} {cat}
                  </option>
                )
              )}
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
              }}
            >
              ➕ Adicionar gasto
            </button>
          </div>

          {gastos.map((item, index) => (
            <div key={index} style={card}>
              <h3>
                {
                  categorias[item.categoria]
                    ?.icone
                }{" "}
                {item.nome}
              </h3>

              <p>{moeda(item.valor)}</p>

              <button
                onClick={() =>
                  removerGasto(index)
                }
              >
                Excluir
              </button>
            </div>
          ))}
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
              onChange={(e) =>
                setNomeConta(e.target.value)
              }
            />

            <div style={{ height: "12px" }} />

            <input
              style={inputStyle}
              type="number"
              placeholder="Valor"
              value={valorConta}
              onChange={(e) =>
                setValorConta(e.target.value)
              }
            />

            <div style={{ height: "12px" }} />

            <select
              style={inputStyle}
              value={categoriaConta}
              onChange={(e) =>
                setCategoriaConta(e.target.value)
              }
            >
              {Object.keys(
                categoriasContas
              ).map((cat) => (
                <option key={cat}>
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
              }}
            >
              ➕ Adicionar conta
            </button>
          </div>

          {contas.map((item, index) => (
            <div key={index} style={card}>
              <h3>
                {
                  categoriasContas[
                    item.categoria
                  ]
                }{" "}
                {item.nome}
              </h3>

              <p>{moeda(item.valor)}</p>

              <button
                onClick={() =>
                  removerConta(index)
                }
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}

      {tela === "metas" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>🎯 Meta</h2>

            <input
              style={inputStyle}
              value={meta}
              onChange={(e) =>
                setMeta(e.target.value)
              }
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
              onChange={(e) =>
                setNome(e.target.value)
              }
            />
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          display: "flex",
          justifyContent: "space-around",
          padding: "10px",
          borderTop: "1px solid #ddd",
        }}
      >
        <button onClick={() => setTela("inicio")}>
          🏠
          <br />
          Início
        </button>

        <button
          onClick={() => setTela("entradas")}
        >
          💰
          <br />
          Entradas
        </button>

        <button onClick={() => setTela("gastos")}>
          💸
          <br />
          Gastos
        </button>

        <button onClick={() => setTela("contas")}>
          📄
          <br />
          Contas
        </button>

        <button onClick={() => setTela("metas")}>
          🎯
          <br />
          Metas
        </button>

        <button onClick={() => setTela("perfil")}>
          👤
          <br />
          Perfil
        </button>
      </div>
    </div>
  );
}
