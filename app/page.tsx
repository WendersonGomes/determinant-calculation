"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {

  const [matrix, setMatrix] = useState<number[][]>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]]
  );

  const [extended, setExtended] = useState<number[][]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [highlight, setHighlight] = useState<{ r: number, c: number }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const pos = [
    [[0, 0], [1, 1], [2, 2]],
    [[0, 1], [1, 2], [2, 3]],
    [[0, 2], [1, 3], [2, 4]],
  ]

  const neg = [
    [[0, 2], [1, 1], [2, 0]],
    [[0, 3], [1, 2], [2, 1]],
    [[0, 4], [1, 3], [2, 2]],
  ]

  function wait(ms: number) {
    return new Promise(res => setTimeout(res, ms))
  }

  async function calculateDeterminant() {
    if (isAnimating) return;

    setShowSteps(true);
    setIsAnimating(true);

    setSteps([]);
    setHighlight([]);

    for (let c = 0; c <= 1; c++) {
      for (let r = 2; r >= 0; r--) {
        setHighlight([{ r, c }]);
        await wait(500);
      }
      await wait(500);
    }

    setHighlight([]);
    await wait(300);

    const extendedMatrix = matrix.map(r => [...r, r[0], r[1]]);
    setExtended(extendedMatrix);

    // Diagonais positivas
    await wait(500);
    let log: string[] = [];
    log.push("Diagonais principais:");

    for (const diagPos of pos) {
      let nums: number[] = [];
      for (const [r, c] of diagPos) {
        setHighlight([{ r, c }]);
        await wait(500);
        nums.push(extendedMatrix[r][c]);
      }

      const product = nums.reduce((a, b) => a * b, 1);
      log.push(`${nums.join(" × ")} = ${product}`)
      setSteps([...log])
      await wait(600)
    }

    setHighlight([]);

    // Diagonais negativas
    log.push("Diagonais secundárias:");
    setSteps([...log]);
    await wait(600);

    for (const diag of neg) {

      let nums: number[] = []

      for (const [r, c] of diag) {
        setHighlight([{ r, c }])
        await wait(350)
        nums.push(extendedMatrix[r][c])
      }

      const mult = nums.reduce((a, b) => a * b, 1)

      log.push(`${nums.join(" × ")} = ${mult}`)
      setSteps([...log])
      await wait(600)
    }

    setHighlight([])

    const positivos = pos.map(diag =>
      diag.reduce((acc, [r, c]) => acc * extendedMatrix[r][c], 1)
    )
    const negativos = neg.map(diag =>
      diag.reduce((acc, [r, c]) => acc * extendedMatrix[r][c], 1)
    )

    const somaPos = positivos.reduce((a, b) => a + b, 0)
    const somaNeg = negativos.reduce((a, b) => a + b, 0)

    log.push(`Soma diagonais principais:`)
    log.push(positivos.map(p => p.toString()).join(" + ") + ` = ${somaPos}`)
    setSteps([...log])
    await wait(500)

    log.push(`Soma diagonais secundárias:`)
    log.push(negativos.map(n => n.toString()).join(" + ") + ` = ${somaNeg}`)
    setSteps([...log])
    await wait(500)

    log.push(`Subtração das diagonais:`);
    log.push(`${somaPos} - ${somaNeg}`)
    setSteps([...log])
    await wait(500)

    const det = somaPos - somaNeg
    log.push(`Determinante:`)
    log.push(`${det}`)
    setSteps([...log])

    setIsAnimating(false)

  }

  function clearInputs() {
    if (isAnimating) return;
    setMatrix([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]]
    );
    setExtended([]);
    setSteps([]);
    setHighlight([]);
    setShowSteps(false);
  }

  function generateRandomMatrix() {
    if (isAnimating) return;
    const randomMatrix = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => Math.floor(Math.random() * 10) - 5)
    );
    setMatrix(randomMatrix);
    setExtended([]);
    setSteps([]);
    setHighlight([]);
    setShowSteps(false);
  }

  return (
    <main className="flex flex-col items-center justify-center p-6">

      <motion.h1 className="font-extrabold mt-4 md:text-3xl text-xl text-center" initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        Cálculo de determinante 3x3 — Regra de Sarrus
      </motion.h1>

      <motion.div className="bg-[#1a1a1a] mt-10 w-full max-w-xl flex flex-col items-center rounded-2xl p-6 shadow-lg" initial={{ opacity: 0, y: -10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease: "easeOut" }}>

        {/* MATRIZ ANIMADA */}
        <div className={`grid gap-2 ${extended.length ? "grid-cols-5" : "grid-cols-3"}`}>
          {(extended.length ? extended : matrix).map((row, r) =>
            row.map((value, c) => {
              const active = highlight.some(h => h.r === r && h.c === c)

              const isExtra = extended.length > 0 && c >= 3

              return (
                <motion.div
                  key={`${r}-${c}`}
                  animate={{
                    scale: active ? 1.25 : 1,
                    backgroundColor: active ? "#985c7e" : "#57394b"
                  }}
                  transition={{ duration: 0.3 }}
                  className="sm:w-16 sm:h-16 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg"
                >
                  {isExtra ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      {value}
                    </motion.div>
                  ) : (
                    <input
                      type="number"
                      disabled={isAnimating}
                      className="w-full h-full bg-transparent text-center font-bold text-white
                        focus:outline-none [appearance:textfield]
                        [&::-webkit-inner-spin-button]:appearance-none 
                        [&::-webkit-outer-spin-button]:appearance-none"
                      value={value}
                      onChange={(e) => {
                        const copy = matrix.map(row => [...row])
                        copy[r][c] = Number(e.target.value)
                        setMatrix(copy)
                      }}
                    />
                  )}
                </motion.div>
              )
            })
          )}
        </div>

        {showSteps && (
          <motion.div className="w-full min-h-[200px] bg-[#] rounded-lg pt-4 pr-4 text-white text-lg space-y-2" initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>

            <h1 className="font-extrabold">Cálculo:</h1>

            {steps.map((s, i) => (
              <motion.div
                className="font-bold"
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {s}
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isAnimating && (
          <div className="w-full rounded-lg text-white text-lg space-y-2 mt-6">
            <button
              disabled={isAnimating}
              onClick={calculateDeterminant}
              className={`w-full p-2 rounded-lg font-bold text-white 
            ${isAnimating ? "bg-gray-500" : "bg-[#57394b] hover:bg-[#985c7e] transition-colors"}`}
            >
              Calcular
            </button>
            <button
              disabled={isAnimating}
              onClick={generateRandomMatrix}
              className={`w-full p-2 rounded-lg font-bold text-white 
            ${isAnimating ? "bg-gray-500" : "bg-[#57394b] hover:bg-[#985c7e] transition-colors"}`}
            >
              Aleatório
            </button>
            <button
              disabled={isAnimating}
              onClick={clearInputs}
              className={`w-full p-2 rounded-lg font-bold text-white 
            ${isAnimating ? "bg-gray-500" : "bg-[#57394b] hover:bg-[#985c7e] transition-colors"}`}
            >
              Limpar
            </button>
          </div>
        )}
      </motion.div>
    </main>
  );
}
