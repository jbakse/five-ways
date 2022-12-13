export function formatPercent(n) {
  if (typeof n !== "number") return n;
  return Math.floor(n * 100) + "%";
}

export function formatDate(s) {
  if (typeof s !== "string") return s;
  return new Date(s).toLocaleString();
}

export function formatDateShort(s) {
  if (typeof s !== "string") return s;

  return new Date(s).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatShort(s) {
  if (typeof s !== "string") return s;
  //recVZKGGAb7BaWPvf -> re..vf
  return s.slice(0, 2) + ".." + s.slice(-2);
}

export function allFalse(a) {
  return a.every((element) => element === false);
}

export function buildQuery(params) {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
