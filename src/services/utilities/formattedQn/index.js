//this is for clinic numbering
const formattedQn = (qn, cluster) => {
  const qnStr = String(qn);
  const main = qnStr.split(".")[0];

  const related = cluster
    .map((item) => String(item.qn))
    .filter((q) => q === main || q.startsWith(main + "."))
    .sort((a, b) => {
      if (a === main) return -1;
      if (b === main) return 1;
      const aSuffix = a.slice(main.length + 1);
      const bSuffix = b.slice(main.length + 1);
      const aNum = Number(aSuffix);
      const bNum = Number(bSuffix);
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
      return aSuffix.localeCompare(bSuffix);
    });

  // only main and no subs -> keep as-is
  if (related.length === 1 && qnStr === main) return main;
  // main present -> main becomes A
  if (qnStr === main) return `${main}A`;

  const idx = related.indexOf(qnStr);
  if (idx === -1) return qnStr; // fallback

  // idx 0 = main -> A, idx 1 = first sub -> B, ...
  return `${main}${String.fromCharCode(65 + idx)}`;
};

export default formattedQn;
