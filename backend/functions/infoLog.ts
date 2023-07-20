export default function (input: any) {
    const ts = new Date().toLocaleString("en-US");
    console.info(`[INFO] ${ts} -> ${input}`)
}