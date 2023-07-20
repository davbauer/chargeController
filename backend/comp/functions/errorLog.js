export default function (input) {
    const ts = new Date().toLocaleString("en-US");
    console.error(`[ERR] ${ts} -> ${input}`);
}
