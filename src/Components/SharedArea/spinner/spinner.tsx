import "./spinner.css";
import loadingGif from "../../../assets/loading.gif";

export function Spinner() {
  return (
    <div className="SharedArea">
      <img src={loadingGif} alt="Loading..." />
    </div>
  );
}
