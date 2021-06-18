const { Router } = require("express");
const { exec } = require("child_process");
const router = Router();
const fs = require("fs");

router.post("/code", (req, res) => {
  const { code } = req.body;
  console.log(code);

  fs.writeFile("execute.ts", code, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  exec(
    "./deno run --allow-net --no-check execute.ts",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(`${stdout}`);

      res.write(
        `<h1 align="center">your output code:</h1> ${stdout}`,
      );
    },
  );
});

module.exports = router;
