export function Logo() {
  return (
    <a className="logo" href="/" aria-label="The Seoul Valeur home">
      <img className="logoMark" src="/images/tsv-logo.png" alt="" width={48} height={48} />
      <span className="logoText">
        <span>The Seoul Valeur</span>
        <small>Seoul Beauty & Travel Journal</small>
      </span>
    </a>
  );
}
