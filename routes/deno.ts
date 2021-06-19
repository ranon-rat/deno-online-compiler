const { Router } = require("express");
const { exec } = require("child_process");
const router = Router();
const fs = require("fs");
const deno = "./deno run --allow-net --no-check  execute.ts";

router.post("/code", (req, res) => {
  const { code } = req.body;
  console.log(code);

  fs.writeFile("execute.ts", code, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  exec(deno, { timeout: 1000 }, (error, stdout, stderr) => {
    console.log(stdout);
    let out = stdout.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    );
    let err = stderr.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    );
    if (stderr) {
      res.write(`<h1 align="center">your error:</h1> <xmp>${err}</xmp> `);
    } else {
      res.write(`<h1 align="center">your output code:</h1> <xmp>${out}</xmp>`);
    }
  });
});

module.exports = router;
