export function formatPercent(n) {
  return Math.floor(n * 100) + "%";
}

export function formatDate(s) {
  return new Date(s).toLocaleString();
}

export function allFalse(a) {
  return a.every((element) => element === false);
}
