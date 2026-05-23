export default function Header({
  usuario,
  nome,
  saldo,
  receitas,
  saidas,
  xp,
  nivel,
  progressoXp,
  ocultarValores,
  setOcultarValores,
  loginGoogle,
  logoutGoogle,
  fotoAtual,
}) {
  const moeda = (valor) => {
    if (ocultarValores) return "••••••";

    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg,#0D47A1,#42A5F5)",
        padding: "24px",
        borderBottomLeftRadius: "32px",
        borderBottomRightRadius: "32px",
        color: "white",
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
          <h1 style={{ margin: 0, fontSize: "28px" }}>
            👋 Olá {usuario?.nome || nome || "Usuário"}
          </h1>

          <p style={{ marginTop: "8px", opacity: 0.9 }}>
            Vamos organizar seu mês?
          </p>
        </div>

        {fotoAtual ? (
          <img
            src={fotoAtual}
            alt="perfil"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid white",
            }}
          />
        ) : (
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            👤
          </div>
        )}
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.12)",
          padding: "18px",
          borderRadius: "24px",
        }}
      >
        <p style={{ margin: 0, opacity: 0.8 }}>Saldo atual</p>

        <h2 style={{ margin: "8px 0", fontSize: "34px" }}>
          {moeda(saldo)}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "14px",
          }}
        >
          <div>
            <p style={{ margin: 0, opacity: 0.8 }}>Receitas</p>
            <strong>{moeda(receitas)}</strong>
          </div>

          <div>
            <p style={{ margin: 0, opacity: 0.8 }}>Saídas</p>
            <strong>{moeda(saidas)}</strong>
          </div>
        </div>

        <div style={{ marginTop: "18px" }}>
          <p style={{ marginBottom: "8px" }}>
            {nivel} • {xp} XP
          </p>

          <div
            style={{
              width: "100%",
              height: "14px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: progressoXp + "%",
                height: "14px",
                background: "#FDD835",
              }}
            />
          </div>
        </div>

        <button
          onClick={() => setOcultarValores(!ocultarValores)}
          style={{
            marginTop: "18px",
            width: "100%",
            padding: "14px",
            borderRadius: "18px",
            border: "none",
            background: "white",
            color: "#0D47A1",
            fontWeight: "bold",
          }}
        >
          {ocultarValores ? "👁 Mostrar valores" : "🙈 Ocultar valores"}
        </button>

        {!usuario ? (
          <button
            onClick={loginGoogle}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "14px",
              borderRadius: "18px",
              border: "none",
              background: "#FDD835",
              color: "#0D47A1",
              fontWeight: "bold",
            }}
          >
            🔐 Entrar com Google
          </button>
        ) : (
          <button
            onClick={logoutGoogle}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "14px",
              borderRadius: "18px",
              border: "none",
              background: "#ef4444",
              color: "white",
              fontWeight: "bold",
            }}
          >
            🚪 Sair da conta
          </button>
        )}
      </div>
    </div>
  );
}
