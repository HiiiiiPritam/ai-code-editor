import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set execution timeout (5 seconds)
const TIMEOUT = 5000;

async function executeCode(language, code) {
  try {
    switch (language) {
      case "python": {
        const process = spawn("python3", ["-c", code]);
        return handleProcess(process);
      }

      case "javascript": {
        const process = spawn("node", ["-e", code]);
        return handleProcess(process);
      }

      case "cpp": {
        const filename = `temp_${Date.now()}`;
        const filepath = path.join("/tmp", filename);

        await writeFile(`${filepath}.cpp`, code);

        // First compile
        const compileProcess = spawn("g++", [
          `${filepath}.cpp`,
          "-o",
          filepath,
        ]);
        const compileResult = await handleProcess(compileProcess);

        if (!compileResult.success) {
          // Cleanup and return compilation error
          await cleanup(filepath);
          return compileResult;
        }

        // Then run
        const runProcess = spawn(filepath);
        const result = await handleProcess(runProcess);

        // Cleanup
        await cleanup(filepath);
        return result;
      }

      default:
        throw new Error("Unsupported language");
    }
  } catch (error) {
    return {
      success: false,
      output: error.message,
    };
  }
}

function handleProcess(process) {
  return new Promise((resolve) => {
    let output = "";
    let error = "";
    let killed = false;

    // Set timeout
    const timeoutId = setTimeout(() => {
      process.kill();
      killed = true;
      resolve({
        success: false,
        output: "Execution timed out",
      });
    }, TIMEOUT);

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      clearTimeout(timeoutId);
      if (!killed) {
        resolve({
          success: code === 0,
          output: error || output,
        });
      }
    });
  });
}

async function cleanup(filepath) {
  try {
    await unlink(`${filepath}.cpp`);
    await unlink(filepath);
  } catch (e) {
    console.error("Cleanup error:", e);
  }
}

export default executeCode;
