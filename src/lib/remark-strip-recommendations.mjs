// Remark-plugin som fjerner "Drømmeguiden anbefaler"-blokken
// (og SV-varianten "Drömguiden rekommenderar") fra slutten av
// drommer/-artikler. Erstattes av <ReflectionPrompts> komponenten
// i Symbol.astro så blokken blir interaktiv i stedet for statisk.

const HEADING_PATTERNS = [
  /^dr(ø|ö)mmeguiden anbefaler/i,
  /^dr(ø|ö)mguiden rekommenderar/i,
];

function isMatch(text) {
  const t = text.trim();
  return HEADING_PATTERNS.some((p) => p.test(t));
}

function headingText(node) {
  return (node.children || []).map((c) => c.value || '').join('');
}

export default function remarkStripRecommendations() {
  return function transformer(tree, file) {
    const filePath = String(file?.path || file?.history?.[0] || '');
    // Bare drommer-kollektioner (NO + SV)
    if (!/[/\\]content[/\\]drommer(-sv)?[/\\]/.test(filePath)) return;

    const children = tree.children || [];
    let startIdx = -1;

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type === 'heading' && node.depth === 2 && isMatch(headingText(node))) {
        startIdx = i;
        break;
      }
    }
    if (startIdx === -1) return;

    // Fjern fra denne H2-en til neste H2 (eller slutten)
    let endIdx = children.length;
    for (let i = startIdx + 1; i < children.length; i++) {
      const node = children[i];
      if (node.type === 'heading' && node.depth === 2) {
        endIdx = i;
        break;
      }
    }

    children.splice(startIdx, endIdx - startIdx);
  };
}
