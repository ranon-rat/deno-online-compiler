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
  }); // @ts-ignore
  exec(
    `./deno run -A --no-check  execute.ts | sed 's/\\x1B\\[[0-9;]\\{1,\\}[A-Za-z]//g'`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(stdout);

      res.write(
        `<h1 align="center">your output code:</h1> <p align="center">${markdown.toHTML(
          stdout
        )}</p>`
      );
    }
  );
});

module.exports = router;
