export function formatPercent(n) {
  return Math.floor(n * 100) + "%";
}

export function formatDate(s) {
  return new Date(s).toLocaleString();
}

export function formatShort(s) {
  //recVZKGGAb7BaWPvf -> re..vf
  return s.substr(0, 2) + ".." + s.substr(-2);
}

export function allFalse(a) {
  return a.every((element) => element === false);
}
