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

  const [gastos, setGastos] = useState(JSON.parse(localStorage.getItem("gastos")) || []);
  const [contas, setContas] = useState(JSON.parse(localStorage.getItem("contasLista")) || []);
  const [historico, setHistorico] = useState(JSON.parse(localStorage.getItem("historicoFinanceiro")) || []);

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

  const metasOpcoes = {
    Casa: { icone: "🏠", cor: "#e8f1ff", texto: "#0D47A1" },
    Viagem: { icone: "✈️", cor: "#fff8e1", texto: "#b7791f" },
    Carro: { icone: "🚗", cor: "#e8f5e9", texto: "#1b5e20" },
    Outros: { icone: "🎯", cor: "#f3e5f5", texto: "#6a1b9a" },
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(
        user
          ? { nome: user.displayName, email: user.email, foto: user.photoURL }
          : null
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => localStorage.setItem("nome", nome), [nome]);
  useEffect(() => localStorage.setItem("salario", salario), [salario]);
  useEffect(() => localStorage.setItem("extra", extra), [extra]);
  useEffect(() => localStorage.setItem("tipoMeta", tipoMeta), [tipoMeta]);
  useEffect(() => localStorage.setItem("nomeMeta", nomeMeta), [nomeMeta]);
  useEffect(() => localStorage.setItem("valorMetaTotal", valorMetaTotal), [valorMetaTotal]);
  useEffect(() => localStorage.setItem("valorGuardado", valorGuardado), [valorGuardado]);
  useEffect(() => localStorage.setItem("meta", meta), [meta]);
  useEffect(() => localStorage.setItem("xp", xp), [xp]);
  useEffect(() => localStorage.setItem("gastos", JSON.stringify(gastos)), [gastos]);
  useEffect(() => localStorage.setItem("contasLista", JSON.stringify(contas)), [contas]);
  useEffect(() => localStorage.setItem("historicoFinanceiro", JSON.stringify(historico)), [historico]);

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

  const valorTotalMeta = Number(valorMetaTotal) || 0;
  const totalGuardado = Number(valorGuardado) || 0;
  const faltaMeta = Math.max(valorTotalMeta - totalGuardado, 0);
  const progressoMeta = valorTotalMeta > 0 ? Math.min((totalGuardado / valorTotalMeta) * 100, 100) : 0;
  const mesesRestantes = Number(meta) > 0 ? Math.ceil(faltaMeta / Number(meta)) : 0;
  const metaVisual = metasOpcoes[tipoMeta] || metasOpcoes.Outros;

  let nivel = "🥉 Bronze";
  let proximoNivel = 500;

  if (xp >= 2000) {
    nivel = "💎 Diamante";
    proximoNivel = 2000;
  } else if (xp >= 1000) {
    nivel = "🥇 Ouro";
    proximoNivel = 2000;
  } else if (xp >= 500) {
    nivel = "🥈 Prata";
    proximoNivel = 1000;
  }

  const progressoXp = proximoNivel > 0 ? Math.min((xp / proximoNivel) * 100, 100) : 100;

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

  function adicionarValorMetaMensal() {
    const confirmar = window.confirm(`Adicionar ${moeda(meta)} ao valor guardado da meta?`);
    if (!confirmar) return;

    setValorGuardado(String(totalGuardado + Number(meta || 0)));
    setXp((prev) => prev + 50);
  }

  function iniciarNovoMes() {
    const confirmar = window.confirm("Deseja fechar o mês atual e iniciar um novo?");
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

    setHistorico([novoHistorico, ...historico]);

    if (saldo > 0) setXp((prev) => prev + 150);
    if (progresso < 70) setXp((prev) => prev + 100);
    if (progressoMeta >= 100) setXp((prev) => prev + 500);

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
  import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { db, auth, provider } from "./firebase";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [nome, setNome] = useState(
    localStorage.getItem("nome") || ""
  );

  const [salario, setSalario] = useState(
    localStorage.getItem("salario") || ""
  );

  const [extra, setExtra] = useState(
    localStorage.getItem("extra") || ""
  );

  const [meta, setMeta] = useState(
    localStorage.getItem("meta") || "500"
  );

  const [tipoMeta, setTipoMeta] = useState(
    localStorage.getItem("tipoMeta") || "Casa"
  );

  const [objetivoMeta, setObjetivoMeta] = useState(
    localStorage.getItem("objetivoMeta") || "50000"
  );

  const [valorGuardado, setValorGuardado] = useState(
    localStorage.getItem("valorGuardado") || "0"
  );

  const [xp, setXp] = useState(
    Number(localStorage.getItem("xp")) || 0
  );

  const [historico, setHistorico] = useState(
    JSON.parse(localStorage.getItem("historicoFinanceiro")) || []
  );

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] =
    useState("Alimentação");

  const [nomeConta, setNomeConta] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [categoriaConta, setCategoriaConta] =
    useState("Luz");

  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
  );

  const [contas, setContas] = useState(
    JSON.parse(localStorage.getItem("contasLista")) || []
  );

  const categorias = {
    Alimentação: {
      icone: "🍔",
      cor: "#fff3e0",
      texto: "#e65100",
    },
    Transporte: {
      icone: "🚗",
      cor: "#e3f2fd",
      texto: "#0D47A1",
    },
    Casa: {
      icone: "🏠",
      cor: "#fff8e1",
      texto: "#8a6d00",
    },
    Saúde: {
      icone: "💊",
      cor: "#e8f5e9",
      texto: "#1b5e20",
    },
    Lazer: {
      icone: "🎮",
      cor: "#f3e5f5",
      texto: "#6a1b9a",
    },
    Outros: {
      icone: "🛒",
      cor: "#e0f2f1",
      texto: "#00695c",
    },
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
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setUsuario({
            nome: user.displayName,
            email: user.email,
            foto: user.photoURL,
          });
        } else {
          setUsuario(null);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("nome", nome);
  }, [nome]);

  useEffect(() => {
    localStorage.setItem("salario", salario);
  }, [salario]);

  useEffect(() => {
    localStorage.setItem("extra", extra);
  }, [extra]);

  useEffect(() => {
    localStorage.setItem("meta", meta);
  }, [meta]);

  useEffect(() => {
    localStorage.setItem("tipoMeta", tipoMeta);
  }, [tipoMeta]);

  useEffect(() => {
    localStorage.setItem(
      "objetivoMeta",
      objetivoMeta
    );
  }, [objetivoMeta]);

  useEffect(() => {
    localStorage.setItem(
      "valorGuardado",
      valorGuardado
    );
  }, [valorGuardado]);

  useEffect(() => {
    localStorage.setItem("xp", xp);
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(
      "historicoFinanceiro",
      JSON.stringify(historico)
    );
  }, [historico]);

  useEffect(() => {
    localStorage.setItem(
      "gastos",
      JSON.stringify(gastos)
    );
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem(
      "contasLista",
      JSON.stringify(contas)
    );
  }, [contas]);

  const moeda = (valor) => {
    if (ocultarValores) return "••••••";

    return Number(valor || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  };

  const receitas =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const totalGastos = gastos.reduce(
    (acc, item) =>
      acc + Number(item.valor || 0),
    0
  );

  const totalContas = contas.reduce(
    (acc, item) =>
      acc + Number(item.valor || 0),
    0
  );

  const saidas = totalGastos + totalContas;

  const saldo =
    receitas -
    saidas -
    (Number(meta) || 0);

  const progresso =
    receitas > 0
      ? Math.min(
          (saidas / receitas) * 100,
          100
        )
      : 0;

  const progressoMeta =
    objetivoMeta > 0
      ? Math.min(
          (Number(valorGuardado) /
            Number(objetivoMeta)) *
            100,
          100
        )
      : 0;

  let nivel = "🥉 Bronze";

  if (xp >= 2000) {
    nivel = "💎 Diamante";
  } else if (xp >= 1000) {
    nivel = "🥇 Ouro";
  } else if (xp >= 500) {
    nivel = "🥈 Prata";
  }

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
      : "🟢 Continue assim!";

  async function loginGoogle() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Erro ao entrar.");
    }
  }

  async function logoutGoogle() {
    try {
      await signOut(auth);
    } catch (error) {
      alert("Erro ao sair.");
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
        usuario:
          usuario?.nome ||
          nome ||
          "Usuário",
        email: usuario?.email || "",
        criadoEm: serverTimestamp(),
      });
    } catch (error) {
      alert(
        "Salvo no celular, mas não na nuvem."
      );
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
    setGastos(
      gastos.filter((_, i) => i !== index)
    );
  }

  function removerConta(index) {
    setContas(
      contas.filter((_, i) => i !== index)
    );
  }

  function iniciarNovoMes() {
    const novoHistorico = {
      mes: new Date().toLocaleDateString(
        "pt-BR",
        {
          month: "long",
          year: "numeric",
        }
      ),
      receitas,
      saidas,
      saldo,
      meta,
    };

    setHistorico([
      novoHistorico,
      ...historico,
    ]);

    setValorGuardado(
      String(
        Number(valorGuardado) +
          Number(meta || 0)
      )
    );

    setXp((prev) => prev + 50);

    if (saldo > 0) {
      setXp((prev) => prev + 150);
    }

    if (progresso < 70) {
      setXp((prev) => prev + 100);
    }

    setSalario("");
    setExtra("");
    setGastos([]);
    setContas([]);

    alert("✅ Novo mês iniciado!");
  }

  const inputStyle = {
    width: "100%",
    padding: "15px",
    borderRadius: "18px",
    border: "1px solid #d9e2f3",
    fontSize: "16px",
    background: "#f9fbff",
    marginBottom: "12px",
  };

  const card = {
    background: "white",
    padding: "22px",
    borderRadius: "28px",
    marginBottom: "18px",
    boxShadow:
      "0 10px 30px rgba(13,71,161,0.10)",
  };

  const navItem = (
    id,
    icon,
    label
  ) => (
    <button
      onClick={() => setTela(id)}
      style={{
        border: "none",
        background:
          tela === id
            ? "#e8f1ff"
            : "transparent",
        color:
          tela === id
            ? "#0D47A1"
            : "#7b8794",
        borderRadius: "18px",
        padding: "8px 9px",
        minWidth: "56px",
        fontWeight: "bold",
        fontSize: "11px",
      }}
    >
      <div
        style={{
          fontSize: "20px",
        }}
      >
        {icon}
      </div>

      <div>{label}</div>
    </button>
  );

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
        <div style={{ textAlign: "center" }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "120px" }}
          />

          <h1>
            Meu Salário Organizado
          </h1>

          <p>
            Organize hoje, realize amanhã
          </p>
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
          background:
            "linear-gradient(180deg,#0D47A1,#063B88)",
          color: "white",
          padding: "28px 22px 34px",
          borderBottomLeftRadius: "38px",
          borderBottomRightRadius: "38px",
        }}
      >
        <img
          src="/logo-horizontal.png"
          alt="logo"
          style={{
            width: "220px",
            display: "block",
            margin: "0 auto 22px",
          }}
        />

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
            setOcultarValores(
              !ocultarValores
            )
          }
          style={{
            padding: "10px 14px",
            borderRadius: "14px",
            border: "none",
          }}
        >
          {ocultarValores
            ? "👁 Mostrar"
            : "🙈 Ocultar"}
        </button>

        <div
          style={{
            background:
              "rgba(255,255,255,0.14)",
            borderRadius: "24px",
            padding: "18px",
            marginTop: "22px",
          }}
        >
          <p>
            Saldo livre após meta
          </p>

          <h1
            style={{
              color: "#FDD835",
            }}
          >
            {moeda(saldo)}
          </h1>

          <p>{status}</p>

          <p>{alerta}</p>

          <div
            style={{
              background:
                "rgba(255,255,255,0.12)",
              padding: "14px",
              borderRadius: "18px",
              marginTop: "12px",
            }}
          >
            <p>{nivel}</p>

            <h3>
              ⭐ {xp} pontos
            </h3>
          </div>
        </div>
      </div>

      {tela === "inicio" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>📊 Resumo</h2>

            <p>
              Entradas:
              <strong>
                {" "}
                {moeda(receitas)}
              </strong>
            </p>

            <p>
              Saídas:
              <strong>
                {" "}
                {moeda(saidas)}
              </strong>
            </p>

            <p>
              Uso salário:
              <strong>
                {" "}
                {progresso.toFixed(0)}%
              </strong>
            </p>
          </div>

          <div style={card}>
            <h2>
              🎯 Meta: {tipoMeta}
            </h2>

            <p>
              Guardado:
              <strong>
                {" "}
                {moeda(valorGuardado)}
              </strong>
            </p>

            <p>
              Objetivo:
              <strong>
                {" "}
                {moeda(objetivoMeta)}
              </strong>
            </p>

            <div
              style={{
                width: "100%",
                height: "18px",
                background: "#e0e7ff",
                borderRadius: "20px",
                overflow: "hidden",
                marginTop: "12px",
              }}
            >
              <div
                style={{
                  width: `${progressoMeta}%`,
                  height: "18px",
                  background:
                    "linear-gradient(90deg,#0D47A1,#42a5f5)",
                }}
              />
            </div>

            <p
              style={{
                marginTop: "10px",
              }}
            >
              {progressoMeta.toFixed(0)}%
              concluído
            </p>
          </div>

          <button
            onClick={iniciarNovoMes}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "22px",
              border: "none",
              background: "#0D47A1",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            🔄 Fechar mês
          </button>
        </div>
      )}

      {tela === "metas" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>🎯 Configurar Meta</h2>

            <select
              style={inputStyle}
              value={tipoMeta}
              onChange={(e) =>
                setTipoMeta(
                  e.target.value
                )
              }
            >
              <option>🏠 Casa</option>
              <option>🚗 Carro</option>
              <option>✈️ Viagem</option>
              <option>💻 Outros</option>
            </select>

            <input
              style={inputStyle}
              placeholder="Meta mensal"
              value={meta}
              onChange={(e) =>
                setMeta(
                  e.target.value
                )
              }
            />

            <input
              style={inputStyle}
              placeholder="Objetivo final"
              value={objetivoMeta}
              onChange={(e) =>
                setObjetivoMeta(
                  e.target.value
                )
              }
            />
          </div>

          <div style={card}>
            <h2>
              📚 Histórico Mensal
            </h2>

            {historico.length === 0 && (
              <p>
                Nenhum mês salvo ainda.
              </p>
            )}

            {historico.map(
              (item, index) => (
                <div
                  key={index}
                  style={{
                    borderBottom:
                      "1px solid #eee",
                    paddingBottom:
                      "12px",
                    marginBottom:
                      "12px",
                  }}
                >
                  <strong>
                    {item.mes}
                  </strong>

                  <p>
                    Saldo:{" "}
                    {moeda(
                      item.saldo
                    )}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: "12px",
          left: "10px",
          right: "10px",
          background:
            "rgba(255,255,255,0.96)",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          padding: "8px",
          borderRadius: "26px",
          boxShadow:
            "0 -8px 30px rgba(0,0,0,0.12)",
        }}
      >
        {navItem(
          "inicio",
          "🏠",
          "Início"
        )}

        {navItem(
          "entradas",
          "💰",
          "Entrada"
        )}

        {navItem(
          "gastos",
          "💸",
          "Gastos"
        )}

        {navItem(
          "contas",
          "📄",
          "Contas"
        )}

        {navItem(
          "metas",
          "🎯",
          "Metas"
        )}

        {navItem(
          "perfil",
          "👤",
          "Perfil"
        )}
      </div>
    </div>
  );
    }
