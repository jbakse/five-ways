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
  //converts string like this: recVZKGGAb7BaWPvf -> re..vf
  return s.slice(0, 2) + ".." + s.slice(-2);
}

export function allFalse(a) {
  return a.every((element) => element === false);
}

export function buildQuery(params) {
  return Object.entries(params)
    .filter(([_, value]) => value) // remove falsy values
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export function padArray(array, newLength, value) {
  array.splice(
    array.length,
    0,
    ...Array.from({ length: newLength - array.length }).fill(value)
  );
}

export function downloadObjectAsJSON(title, data) {
  if (typeof data !== "object") return;

  // prepare content string
  const jsonString = JSON.stringify(data, undefined, 2);

  // download
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `${title || "data"}.json`;
  a.href = url;
  a.click();
}

export function downloadArrayAsCSV(title, data) {
  if (!Array.isArray(data)) return;
  if (data.length === 0) return;

  // encode content string
  const keys = Object.keys(data[0]);
  const csv = data.map((row) => keys.map((k) => `"${row[k]}"`).join(","));
  csv.unshift(keys.join(","));
  const csvString = csv.join("\n");

  // download
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `${title || "data"}.csv`;
  a.href = url;
  a.click();
}
