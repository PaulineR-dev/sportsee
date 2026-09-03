import logo2 from "../assets/logo2.png";

export default function Footer() {
  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        backgroundColor: "#fff",
        borderTop: "1px solid #eee",
        fontSize: "14px",
        color: "#000",
      }}
    >
      <div>©Sportsee&nbsp;&nbsp;Tous droits réservés</div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <a href="/conditions" style={{ color: "#000", textDecoration: "none" }}>
          Conditions générales
        </a>
        <a href="/contact" style={{ color: "#000", textDecoration: "none" }}>
          Contact
        </a>

        <img
          src={logo2}
          alt="Logo Sportsee"
          style={{ width: "20px", height: "20px" }}
        />
      </div>
    </footer>
  );
}
