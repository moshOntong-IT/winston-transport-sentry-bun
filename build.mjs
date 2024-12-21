import dts from "bun-plugin-dts";

await Bun.build({
  entrypoints: ["./src/transport.ts"],
  outdir: "./dist",
  target: "bun",
  plugins: [dts()],
});
