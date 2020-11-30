import "./App.css";
import FeatureBox from "./detector-subpages-container";
import data from "./ApiIp";
function App() {
  // Switch different ApiIP: general, qrcode, tables, screen
  let url_post = data.general.url;

  return (
    <div className="App">
      <FeatureBox url_post={url_post} />
    </div>
  );
}

export default App;
