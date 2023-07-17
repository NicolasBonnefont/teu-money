import { getTotais } from "@/app/server/lancamentos/Lancamentos"
import { FiArrowDownCircle, FiArrowUpCircle, FiDollarSign } from "react-icons/fi"
import Card from "../card"

type totaisProps = {
  total_entrada: number,
  total_saida: number
  total: number
}
export const revalidate = 0

async function Totais() {

  const totais = await getTotais()

  return (
    <div className="text-black flex justify-evenly max-xl:flex-wrap gap-4 max-sm:gap-0">
      <Card
        titulo='Entrada'
        valor={totais?.total_entrada}
        Icone={<FiArrowUpCircle />}
      />

      <Card
        titulo="Saida"
        valor={totais?.total_saida}
        Icone={<FiArrowDownCircle />}
      />

      <Card
        titulo="Saldo"
        valor={totais?.total}
        Icone={<FiDollarSign />}
      />

    </div>
  )

}

export default Totais