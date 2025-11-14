export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-6">
      <h1 className="font-extrabold mt-4 md:text-3xl text-xl text-center">
        Cálculo de determinante de uma matriz 3x3 utilizando Regra de Sarrus
      </h1>

      {/* Área dos painéis */}
      <div className="grid w-full h-full max-w-5xl max-h-5xl gap-6 mt-10 grid-cols-1 sm:grid-cols-2">

        {/* Painel 1 */}
        <div className="bg-[#033349] flex flex-col items-center justify-center rounded-2xl p-6 shadow-lg">
          <h2 className="font-bold md:text-2xl text-lg mb-4 text-white">Insira os valores da matriz:</h2>
          <form className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <input
                key={index}
                type="number"
                className="border-2 rounded-lg p-2 w-16 h-16 text-center font-bold focus:outline-none 
    focus:border-[#00807d]
    focus:ring-2 focus:ring-[#00807d]"
                placeholder={"x"}
              />
            ))}
          </form>
          <div className="flex flex-row gap-5 justify-center items-center">
            <button className="p-4 mt-4 bg-[#005f61] text-white rounded-lg font-bold hover:bg-[#00807d] transition-colors">
              Calcular Determinante
            </button>
            <button className="p-4 mt-4 bg-[#005f61] text-white rounded-lg font-bold hover:bg-[#00807d] transition-colors">
              Limpar
            </button>
            <button className="p-4 mt-4 bg-[#005f61] text-white rounded-lg font-bold hover:bg-[#00807d] transition-colors">
              Aleatório
            </button>
          </div>
        </div>

        {/* Painel 2 */}
        <div className="bg-[#036564] flex flex-col items-center justify-center rounded-2xl p-6 shadow-lg">
          <h2 className="font-bold md:text-2xl text-lg mb-4 text-white">Resultado do determinante:</h2>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <input
                disabled={true}
                key={index}
                type="number"
                className="border-2 rounded-lg p-2 w-16 h-16 text-center font-bold focus:outline-none
    focus:border-[#004f73]
    focus:ring-2 focus:ring-[#004f73]"
                placeholder={"x"}
              />
            ))}
          </div>
          <div className="flex flex-row gap-5 justify-center items-center">
            <button className="p-4 mt-4 bg-[#004f73] text-white rounded-lg font-bold hover:bg-[#00807d] transition-colors">
              Limpar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
