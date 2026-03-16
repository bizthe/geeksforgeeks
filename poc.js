import axios from "axios";
import fs from "fs";

const code = fs.readFileSync("poc.cpp", "utf-8");

async function submit(code) {
  try {
    const { data: submitData } = await axios.post(
      "https://codejudge.geeksforgeeks.org/submit-request",
      {
        language: "cpp",
        driver_code: code,
        user_code: "",
        input: "",
        is_full_prob: 1,
        save: false,
      },
    );

    console.log("[INFO] Submission ID:", submitData.id);

    const result = await axios.get(
      `https://codejudge.geeksforgeeks.org/get-status/${submitData.id}`,
    );

    console.log("[INFO] HTTP status:", result.status);

    if (result.data.message === "Invalid language") {
      console.log("[ERROR] Invalid language!");
      process.exit(1);
    }

    switch (result.data.compResult) {
      case "S":
        console.log("[INFO] No errors.");
        console.log(result.data.output);
        break;
      case "F":
        console.log("[ERROR] Failed!");
        console.log(result.data.cmpError);
        break;
    }
  } catch (e) {
    console.log(e.response?.data || e.message);
    process.exit(1);
  }
}

submit(code);
