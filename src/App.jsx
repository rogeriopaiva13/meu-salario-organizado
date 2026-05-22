// =========================
// PARTE 1
// =========================

import React, { useState, useEffect } from "react";

import {
  FaHome,
  FaWallet,
  FaBullseye,
  FaTrophy,
  FaUser,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaHistory,
  FaCreditCard,
} from "react-icons/fa";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

import { db, auth, provider } from "./firebase";

export default function App() {

  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [fotoPerfil, setFotoPerfil] = useState(localStorage.getItem("fotoPerfil") || "");
  const [nome, setNome] = useState(localStorage.getItem("nome") || "");
  const [salario, setSalario] = useState(localStorage.getItem("salario") || "");
  const [extra, setExtra] = useState(localStorage.getItem("extra") || "");

  const [tipoMeta, setTipoMeta] = useState(localStorage.getItem("tipoMeta") || "Carro");
  const [nomeMeta, setNomeMeta] = useState(localStorage.getItem("nomeMeta") || "Meu objetivo");
  const [valorMetaTotal, setValorMetaTotal] = useState(localStorage.getItem("valorMetaTotal") || "30000");
  const [valorGuardado, setValorGuardado] = useState(localStorage.getItem("valorGuardado") || "0");
  const [meta, setMeta] = useState(localStorage.getItem("meta") || "500");
  const [xp, setXp] = useState(Number(localStorage.getItem("xp")) || 0);

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] = useState("Alimentação");

  const [nomeConta, setNomeConta] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [categoriaConta, setCategoriaConta] = useState("Luz");

  // NOVOS CAMPOS
  const [tipoConta, setTipoConta] = useState("Conta fixa");
  const [vencimentoConta, setVencimentoConta] = useState("");

  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
  );

  const [contas, setContas] = useState(
    JSON.parse(localStorage.getItem("contasLista")) || []
  );

  const [historico, setHistorico] = useState(
    JSON.parse(localStorage.getItem("historicoFinanceiro")) || []
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
    Cartão: "💳",
    Outros: "📄",
  };

  const metasOpcoes = {
    Casa: { icone: "🏠", cor: "#e8f1ff", texto: "#0D47A1" },
    Viagem: { icone: "✈️", cor: "#fff8e1", texto: "#b7791f" },
    Carro: { icone: "🚗", cor: "#e8f5e9", texto: "#1b5e20" },
    Outros: { icone: "🎯", cor: "#f3e5f5", texto: "#6a1b9a" },
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(
        user
          ? {
              nome: user.displayName,
              email: user.email,
              foto: user.photoURL,
            }
          : null
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => localStorage.setItem("fotoPerfil", fotoPerfil), [fotoPerfil]);
  useEffect(() => localStorage.setItem("nome", nome), [nome]);
  useEffect(() => localStorage.setItem("salario", salario), [salario]);
  useEffect(() => localStorage.setItem("extra", extra), [extra]);
  useEffect(() => localStorage.setItem("tipoMeta", tipoMeta), [tipoMeta]);
  useEffect(() => localStorage.setItem("nomeMeta", nomeMeta), [nomeMeta]);
  useEffect(() => localStorage.setItem("valorMetaTotal", valorMetaTotal), [valorMetaTotal]);
  useEffect(() => localStorage.setItem("valorGuardado", valorGuardado), [valorGuardado]);
  useEffect(() => localStorage.setItem("meta", meta), [meta]);
  useEffect(() => localStorage.setItem("xp", String(xp)), [xp]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem("contasLista", JSON.stringify(contas));
  }, [contas]);

  useEffect(() => {
    localStorage.setItem("historicoFinanceiro", JSON.stringify(historico));
  }, [historico]);

  const fotoAtual = fotoPerfil || usuario?.foto || "";

  function escolherFoto(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => setFotoPerfil(leitor.result);

    leitor.readAsDataURL(arquivo);
  }

  function removerFotoPerfil() {
    const confirmar = window.confirm(
      "Deseja remover a foto do perfil?"
    );

    if (!confirmar) return;

    setFotoPerfil("");
    localStorage.removeItem("fotoPerfil");
  }

  const moeda = (valor) => {
    if (ocultarValores) return "••••••";

    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const receitas =
    (Number(salario) || 0) + (Number(extra) || 0);

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
    receitas - saidas - (Number(meta) || 0);

  const progresso =
    receitas > 0
      ? Math.min((saidas / receitas) * 100, 100)
      : 0;
// =========================
// PARTE 2
// =========================

  const valorTotalMeta = Number(valorMetaTotal) || 0;
  const totalGuardado = Number(valorGuardado) || 0;

  const faltaMeta = Math.max(
    valorTotalMeta - totalGuardado,
    0
  );

  const progressoMeta =
    valorTotalMeta > 0
      ? Math.min(
          (totalGuardado / valorTotalMeta) * 100,
          100
        )
      : 0;

  const mesesRestantes =
    Number(meta) > 0
      ? Math.ceil(faltaMeta / Number(meta))
      : 0;

  const metaVisual =
    metasOpcoes[tipoMeta] || metasOpcoes.Outros;

  let nivel = "🪙 Estagiário Financeiro";
  let proximoNivel = 500;

  if (xp >= 3000) {
    nivel = "💎 Lenda Financeira";
    proximoNivel = 3000;
  } else if (xp >= 2000) {
    nivel = "🚀 Magnata";
    proximoNivel = 3000;
  } else if (xp >= 1000) {
    nivel = "👑 CEO das Finanças";
    proximoNivel = 2000;
  } else if (xp >= 500) {
    nivel = "📈 Analista Financeiro";
    proximoNivel = 1000;
  }

  const progressoXp = Math.min(
    (xp / proximoNivel) * 100,
    100
  );

  function ganharXp(valor) {
    setXp((prev) => prev + valor);
  }

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

    ganharXp(5);

    try {

      await addDoc(collection(db, "gastos"), {
        ...novo,
        usuario: usuario?.nome || nome || "Usuário",
        email: usuario?.email || "",
        criadoEm: serverTimestamp(),
      });

    } catch (error) {

      console.error(error);

      alert(
        "Gasto salvo no celular, mas não foi para a nuvem."
      );
    }

    setNomeGasto("");
    setValorGasto("");
  }

  // =================================
  // NOVA FUNÇÃO CONTAS
  // =================================

  function adicionarConta() {

    if (
      !nomeConta ||
      !valorConta ||
      !vencimentoConta
    )
      return;

    setContas([
      ...contas,
      {
        nome: nomeConta,
        valor: Number(valorConta),
        categoria: categoriaConta,
        tipo: tipoConta,
        vencimento: vencimentoConta,
      },
    ]);

    ganharXp(5);

    setNomeConta("");
    setValorConta("");
    setVencimentoConta("");
  }

  function removerGasto(index) {
    setGastos(
      gastos.filter((_, i) => i !== index)
    );
  }

  function removerConta(index) {
    setContas(
      contas.filter((_, i) => i !== index)
    );
  }

  function adicionarValorMetaMensal() {

    const confirmar = window.confirm(
      `Adicionar ${moeda(
        meta
      )} ao valor guardado da meta?`
    );

    if (!confirmar) return;

    setValorGuardado(
      String(totalGuardado + Number(meta || 0))
    );

    ganharXp(20);
  }

  function iniciarNovoMes() {

    const confirmar = window.confirm(
      "Deseja fechar o mês atual e iniciar um novo?"
    );

    if (!confirmar) return;

    const agora = new Date();

    const novoHistorico = {
      mes: agora.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      }),
      entradas: receitas,
      gastos: totalGastos,
      contas: totalContas,
      metaMensal: Number(meta) || 0,
      saldo,
      criadoEm: agora.toISOString(),
    };

    setHistorico([
      novoHistorico,
      ...historico,
    ]);

    if (saldo > 0) ganharXp(100);

    setGastos([]);
    setContas([]);
    setSalario("");
    setExtra("");

    localStorage.removeItem("gastos");
    localStorage.removeItem("contasLista");
    localStorage.removeItem("salario");
    localStorage.removeItem("extra");
  }

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    border: "1px solid #d9e2f3",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    background: "#f9fbff",
  };

  const card = {
    background: "white",
    padding: "22px",
    borderRadius: "30px",
    marginBottom: "18px",
    boxShadow:
      "0 16px 40px rgba(13,71,161,0.10)",
    border: "1px solid rgba(13,71,161,0.06)",
  };

  const primaryButton = {
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    border: "none",
    background:
      "linear-gradient(135deg,#0D47A1,#1976D2)",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
  };

  // =================================
  // BOTÃO QUE SOBE A TELA
  // =================================

  const navItem = (id, icon, label) => (

    <button

      onClick={() => {

        setTela(id);

        setTimeout(() => {

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

        }, 100);
      }}

      style={{
        border: "none",
        background:
          tela === id
            ? "#0D47A1"
            : "transparent",
        color:
          tela === id
            ? "white"
            : "#6b7280",
        borderRadius: "22px",
        padding: "10px 12px",
        minWidth: "64px",
        fontWeight: "bold",
        fontSize: "11px",
      }}
    >

      <div
        style={{
          fontSize: "20px",
          lineHeight: "20px",
        }}
      >
        {icon}
      </div>

      <div style={{ marginTop: "4px" }}>
        {label}
      </div>

    </button>
  );

  const AppLogo = () => (

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "end",
          gap: "4px",
          height: "48px",
        }}
      >

        <div
          style={{
            width: "10px",
            height: "22px",
            background: "white",
            borderRadius: "5px",
          }}
        />

        <div
          style={{
            width: "10px",
            height: "34px",
            background: "white",
            borderRadius: "5px",
          }}
        />

        <div
          style={{
            width: "10px",
            height: "46px",
            background: "white",
            borderRadius: "5px",
          }}
        />

        <div
          style={{
            width: "10px",
            height: "28px",
            background: "#FDD835",
            borderRadius: "5px",
          }}
        />

      </div>

      <div style={{ lineHeight: "32px" }}>

        <div
          style={{
            fontSize: "30px",
            fontWeight: "900",
            color: "white",
          }}
        >
          Meu Salário
        </div>

        <div
          style={{
            fontSize: "27px",
            fontWeight: "900",
            color: "#FDD835",
          }}
        >
          Organizado
        </div>

      </div>

    </div>
  );
// =========================
// PARTE 3
// =========================

  const AvatarPerfil = () => (

    <label style={{ cursor: "pointer" }}>

      <input
        type="file"
        accept="image/*"
        onChange={escolherFoto}
        style={{ display: "none" }}
      />

      {fotoAtual ? (

        <img
          src={fotoAtual}
          alt="foto"
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "3px solid white",
            objectFit: "cover",
          }}
        />

      ) : (

        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "3px solid white",
            background:
              "rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          👤
        </div>
      )}

    </label>
  );

  if (loading) {

    return (

      <div
        style={{
          background:
            "linear-gradient(135deg,#0D47A1,#42A5F5)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "Arial",
        }}
      >

        <div style={{ textAlign: "center" }}>
          <AppLogo />

          <p
            style={{
              color: "#FDD835",
              marginTop: "18px",
            }}
          >
            Organize hoje, realize amanhã
          </p>
        </div>

      </div>
    );
  }

  return (

    <div
      style={{
        background: "#f3f7ff",
        minHeight: "100vh",
        paddingBottom: "125px",
        fontFamily: "Arial",
      }}
    >

      {/* RESTANTE DO APP CONTINUA NORMAL */}

      {/* ================================= */}
      {/* BLOCO CONTAS FIXAS ATUALIZADO */}
      {/* ================================= */}

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

              {Object.keys(categoriasContas).map(
                (cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {categoriasContas[cat]} {cat}
                  </option>
                )
              )}

            </select>

            <div style={{ height: "12px" }} />

            <select
              style={inputStyle}
              value={tipoConta}
              onChange={(e) =>
                setTipoConta(e.target.value)
              }
            >

              <option>
                Conta fixa
              </option>

              <option>
                Cartão de crédito
              </option>

            </select>

            <div style={{ height: "12px" }} />

            <input
              style={inputStyle}
              type="number"
              placeholder="Dia do vencimento"
              value={vencimentoConta}
              onChange={(e) =>
                setVencimentoConta(
                  e.target.value
                )
              }
            />

            <div style={{ height: "16px" }} />

            <button
              onClick={adicionarConta}
              style={primaryButton}
            >
              ➕ Adicionar conta +5 XP
            </button>

          </div>

          {contas.map((item, index) => {

            const hoje = new Date().getDate();

            const vencendo =
              Number(item.vencimento) - hoje <= 3 &&
              Number(item.vencimento) - hoje >= 0;

            const atrasada =
              hoje > Number(item.vencimento);

            return (

              <div
                key={index}
                style={{
                  ...card,
                  border:
                    atrasada
                      ? "2px solid #ef4444"
                      : vencendo
                      ? "2px solid #f59e0b"
                      : "1px solid rgba(13,71,161,0.06)",
                }}
              >

                <h3>
                  {item.tipo ===
                  "Cartão de crédito"
                    ? "💳"
                    : categoriasContas[
                        item.categoria
                      ]}{" "}

                  {item.nome}
                </h3>

                <p>
                  <strong>
                    {moeda(item.valor)}
                  </strong>
                </p>

                <p>
                  📅 Vence dia{" "}
                  <strong>
                    {item.vencimento}
                  </strong>
                </p>

                {vencendo && !atrasada && (
                  <div
                    style={{
                      background: "#fff7ed",
                      color: "#c2410c",
                      padding: "10px",
                      borderRadius: "14px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    ⚠️ Conta vencendo em breve
                  </div>
                )}

                {atrasada && (
                  <div
                    style={{
                      background: "#fef2f2",
                      color: "#b91c1c",
                      padding: "10px",
                      borderRadius: "14px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    🚨 Conta atrasada
                  </div>
                )}

                <button
                  onClick={() =>
                    removerConta(index)
                  }
                >
                  Excluir
                </button>

              </div>
            );
          })}

        </div>
      )}

      {/* ================================= */}
      {/* MENU INFERIOR */}
      {/* ================================= */}

      <div
        style={{
          position: "fixed",
          bottom: "12px",
          left: "8px",
          right: "8px",
          background:
            "rgba(255,255,255,0.98)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px",
          borderRadius: "28px",
          boxShadow:
            "0 -8px 30px rgba(0,0,0,0.12)",
          border: "1px solid #e5eaf3",
          zIndex: 999,
          overflowX: "auto",
        }}
      >

        {navItem(
          "inicio",
          <FaHome />,
          "Início"
        )}

        {navItem(
          "entradas",
          <FaMoneyBillWave />,
          "Entradas"
        )}

        {navItem(
          "gastos",
          <FaWallet />,
          "Gastos"
        )}

        {navItem(
          "contas",
          <FaFileInvoiceDollar />,
          "Contas"
        )}

        {navItem(
          "metas",
          <FaBullseye />,
          "Metas"
        )}

        {navItem(
          "historico",
          <FaHistory />,
          "Hist."
        )}

        {navItem(
          "conquistas",
          <FaTrophy />,
          "Conq."
        )}

        {navItem(
          "perfil",
          <FaUser />,
          "Perfil"
        )}

      </div>

    </div>
  );
}

