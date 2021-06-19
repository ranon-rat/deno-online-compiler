const { Router } = require("express");
const { exec } = require("child_process");
const router = Router();
const fs = require("fs");
const markdown = require("markdown").markdown;

router.post("/code", (req, res) => {
  const { code } = req.body;
  console.log(code);

  fs.writeFile("execute.ts", code, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  exec(`./deno run -A --no-check  execute.ts`, (error, stdout, stderr) => {
    console.log(stdout);
    let out = markdown
      .toHTML(stdout || "")
      .replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
      );
    let err = markdown
      .toHTML(stderr || "")
      .replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
      );
    res.write(
      `<div align="center"><h1>your output code:</h1> <p>${out}</p> <h1>possibly error:</h1> ${err} </div>`
    );
  });
});

module.exports = router;
