import BlurText from '../BlurText.jsx';
import './Slogan.css';

function Slogan() {
  return (
    <div className="slogan">
      <span className="slogan-line slogan-line--calligraphy">
        启迪生命 · 扉向未来
      </span>
      <span className="slogan-line slogan-line--sub">
        <BlurText
          text="一粒因热爱播种的种子 在江农的土壤里生根发芽"
          animateBy="letters"
          delay={60}
          direction="top"
        />
      </span>
    </div>
  );
}

export default Slogan;
