import logo2 from "../assets/logo2.png";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-left">
        <p>©Sportsee</p>
        <p>Tous droits réservés</p>
      </div>

      <div className="footer-right">
        <a href="/conditions">Conditions générales</a>
        <a href="/contact">Contact</a>

        <img
          src={logo2}
          alt="Logo Sportsee"
          className="footer-logo"
        />
      </div>
    </footer>
  );
}
