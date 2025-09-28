import Header from "./header";
import Body from "./body";

import "./requestForm.css";

export default function Request({ note }) {
  return (
    <div className="note-request-container">
      <div>
        <table>
          <Header note={note} />
          <Body note={note} />
        </table>
      </div>
    </div>
  );
}
