import Physical from "./physical";
import Chemical from "./chemical";
import Microscopic from "./microscopic";

export default function Urinalysis({ fontSize, task }) {
  const style = { fontSize: `${fontSize}rem` },
    { pe, ce, me } = task;

  return (
    <>
      <Physical physical={pe} style={style} />
      <Chemical style={style} Chemical={ce} />
      <Microscopic Microscopic={me} style={style} />
    </>
  );
}
