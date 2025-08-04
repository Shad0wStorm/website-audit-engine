import { runA11yScan } from "../src/core/accessibilityScan";

(async () => {
    const result = await runA11yScan('https://example.com');
    console.log(JSON.stringify(result, null, 2));
})();

