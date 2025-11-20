"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {

  // Matriz principal 3x3
  const [matrix, setMatrix] = useState<number[][]>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]]
  );

  // Matriz estendida 3x5
  const [extended, setExtended] = useState<number[][]>([]);
  // Passos do cálculo
  const [steps, setSteps] = useState<string[]>([]);
  // Destaques na matriz
  const [highlight, setHighlight] = useState<{ r: number, c: number }[]>([]);
  // Animação em andamento
  const [isAnimating, setIsAnimating] = useState(false);
  // Mostrar passos
  const [showSteps, setShowSteps] = useState(false);

  // Diagonal principal
  const main = [
    [[0, 0], [1, 1], [2, 2]],
    [[0, 1], [1, 2], [2, 3]],
    [[0, 2], [1, 3], [2, 4]],
  ]

  // Diagonal secundária
  const secondary = [
    [[0, 2], [1, 1], [2, 0]],
    [[0, 3], [1, 2], [2, 1]],
    [[0, 4], [1, 3], [2, 2]],
  ]

  useEffect(() => {
    const savedMatrix = localStorage.getItem("matrix");
    const savedValues = localStorage.getItem("values");

    if (savedMatrix) {
      setMatrix(JSON.parse(savedMatrix));
    }

    if (savedValues) {
      const data = JSON.parse(savedValues);
      setSteps(data.steps);
      setShowSteps(data.showSteps);
      setExtended(data.extended);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("matrix", JSON.stringify(matrix));
  }, [matrix]);

  function wait(ms: number) {
    return new Promise(res => setTimeout(res, ms))
  }

  function calculateDeterminantInstant() {
    const extendedMatrix = matrix.map(r => [...r, r[0], r[1]]);

    const posMain = main.map(diag =>
      diag.reduce((acc, [r, c]) => acc * extendedMatrix[r][c], 1)
    );

    const posSecondary = secondary.map(diag =>
      diag.reduce((acc, [r, c]) => acc * extendedMatrix[r][c], 1)
    );

    const sumMain = posMain.reduce((a, b) => a + b, 0);
    const sumSecondary = posSecondary.reduce((a, b) => a + b, 0);
    const det = sumMain - sumSecondary;

    const log = [
      "Multiplicação das diagonais principais:",
      ...main.map(diag =>
        diag.map(([r, c]) => extendedMatrix[r][c]).join(" × ") +
        " = " +
        diag.reduce((acc, [r, c]) => acc * extendedMatrix[r][c], 1)
      ),
      "Multiplicação das diagonais secundárias:",
      ...secondary.map(diag =>
        diag.map(([r, c]) => extendedMatrix[r][c]).join(" × ") +
        " = " +
        diag.reduce((acc, [r, c]) => acc * extendedMatrix[r][c], 1)
      ),
      `Soma das diagonais principais:`,
      posMain.join(" + ") + ` = ${sumMain}`,
      `Soma das diagonais secundárias:`,
      posSecondary.join(" + ") + ` = ${sumSecondary}`,
      `Subtração das diagonais:`,
      `${sumMain} - ${sumSecondary}`,
      `Determinante:`,
      `${det}`
    ];

    setShowSteps(true);
    setSteps(log);
    setExtended(extendedMatrix);

    return {
      steps: log,
      extended: extendedMatrix,
      showSteps: true
    }
  }

  async function calculateDeterminantAnimated() {
    if (isAnimating) return;

    setShowSteps(true);
    setIsAnimating(true);

    setSteps([]);
    setHighlight([]);
    setExtended([]);

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

    // Diagonais principais
    let log: string[] = [];
    log.push("Multiplicação das diagonais principais:");
    await wait(300);

    for (const diagMain of main) {
      let nums: number[] = [];
      for (const [r, c] of diagMain) {
        setHighlight([{ r, c }]);
        await wait(500);
        nums.push(extendedMatrix[r][c]);
      }

      const product = nums.reduce((a, b) => a * b, 1);
      log.push(`${nums.join(" × ")} = ${product}`)
      setSteps([...log])
      await wait(500)
    }

    setHighlight([]);
    await wait(300);

    // Diagonais secundárias
    log.push("Multiplicação das diagonais secundárias:");
    setSteps([...log]);
    await wait(300);

    for (const diag of secondary) {

      let nums: number[] = []

      for (const [r, c] of diag) {
        setHighlight([{ r, c }])
        await wait(500)
        nums.push(extendedMatrix[r][c])
      }

      const mult = nums.reduce((a, b) => a * b, 1)

      log.push(`${nums.join(" × ")} = ${mult}`)
      setSteps([...log])
      await wait(500)
    }

    setHighlight([])
    await wait(300);

    const posMain = main.map(diag =>
      diag.reduce((acc, [r, c]) => acc * extendedMatrix[r][c], 1)
    )
    const posSecondary = secondary.map(diag =>
      diag.reduce((acc, [r, c]) => acc * extendedMatrix[r][c], 1)
    )

    const sumMain = posMain.reduce((a, b) => a + b, 0)
    const sumSecondary = posSecondary.reduce((a, b) => a + b, 0)

    log.push(`Soma das diagonais principais:`)
    log.push(posMain.map(p => p.toString()).join(" + ") + ` = ${sumMain}`)
    setSteps([...log])
    await wait(500)

    log.push(`Soma das diagonais secundárias:`)
    log.push(posSecondary.map(n => n.toString()).join(" + ") + ` = ${sumSecondary}`)
    setSteps([...log])
    await wait(500)

    log.push(`Subtração das diagonais:`);
    log.push(`${sumMain} - ${sumSecondary}`)
    setSteps([...log])
    await wait(500)

    const det = sumMain - sumSecondary
    log.push(`Determinante:`)
    log.push(`${det}`)
    setSteps([...log])

    setIsAnimating(false)
  }

  async function handleCalculateDeterminant() {
    const value = calculateDeterminantInstant();

    localStorage.setItem("values", JSON.stringify(value));
    calculateDeterminantAnimated();
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
    localStorage.removeItem("values");
  }

  function generateRandomMatrix() {
    if (isAnimating) return;
    const randomMatrix = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => Math.floor(Math.random() * 10) - 5)
    );
    setMatrix(randomMatrix);
    localStorage.setItem("matrix", JSON.stringify(randomMatrix));
    setExtended([]);
    setSteps([]);
    setHighlight([]);
    setShowSteps(false);
    localStorage.removeItem("values");
  }

  return (
    <main className="flex flex-col items-center justify-center p-6">

      <motion.h1 className="font-extrabold mt-4 md:text-3xl text-xl text-center" initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        Cálculo de determinante 3x3 - Regra de Sarrus
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
                  transition={{
                    duration: 0.3,
                    backgroundColor: {
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: r * 0.05,
                    }, ease: "easeOut"
                  }}
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

                        if (extended.length > 0) {
                          setExtended(copy.map(r => [...r, r[0], r[1]]))
                        }
                      }}
                    />
                  )}
                </motion.div>
              )
            })
          )}
        </div>
        <AnimatePresence>
          {showSteps && (
            <motion.div className="w-full rounded-lg pt-4 pr-4 text-white text-lg space-y-2" initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0, y: -10, transition: {
                  duration: 0.2
                }
              }}
              transition={{
                duration: 0.9,
              }}>

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
        </AnimatePresence>

        <AnimatePresence>
          {!isAnimating && (
            <motion.div className="w-full rounded-lg text-white text-lg space-y-2 mt-6" initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}>
              <button
                disabled={isAnimating}
                onClick={handleCalculateDeterminant}
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div >
    </main >
  );
}
