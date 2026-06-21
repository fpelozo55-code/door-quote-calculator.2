"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Parametros } from "@/lib/cotizador"
import { Ruler, Layers, Wrench, PlusCircle, SquareStack } from "lucide-react"

type Campo = {
  key: keyof Parametros
  label: string
  step?: string
  suffix?: string
}

type Grupo = {
  titulo: string
  subtitulo?: string
  icon: React.ReactNode
  campos: Campo[]
}

const GRUPOS: Grupo[] = [
  {
    titulo: "Dimensiones y aluminio",
    icon: <Ruler className="size-4" />,
    campos: [
      { key: "ancho", label: "Ancho puerta", suffix: "m", step: "0.01" },
      { key: "alto", label: "Alto puerta", suffix: "m", step: "0.01" },
      { key: "precioKg", label: "Precio aluminio por Kg", suffix: "$", step: "100" },
      { key: "ganancia", label: "Ganancia", suffix: "%", step: "1" },
    ],
  },
  {
    titulo: "Pesos de perfiles (kg/m)",
    icon: <Layers className="size-4" />,
    campos: [
      { key: "pesoMarco", label: "Peso marco", suffix: "kg/m", step: "0.001" },
      { key: "pesoBatiente", label: "Peso batiente", suffix: "kg/m", step: "0.001" },
      { key: "pesoTravesano", label: "Peso travesaño", suffix: "kg/m", step: "0.001" },
      { key: "pesoTablilla", label: "Peso tablilla", suffix: "kg/m", step: "0.001" },
      { key: "cantTravesanos", label: "Cantidad travesaños", step: "1" },
      { key: "anchoTablilla", label: "Ancho tablilla", suffix: "m", step: "0.01" },
    ],
  },
  {
    titulo: "Revestimiento",
    subtitulo: "(vidrio, policarbonato, etc.)",
    icon: <SquareStack className="size-4" />,
    campos: [
      { key: "revAncho", label: "Ancho", suffix: "m", step: "0.01" },
      { key: "revAlto", label: "Alto", suffix: "m", step: "0.01" },
      { key: "precioRevM2", label: "Precio por m²", suffix: "$", step: "100" },
    ],
  },
  {
    titulo: "Accesorios",
    icon: <Wrench className="size-4" />,
    campos: [
      { key: "bisagras", label: "Cantidad bisagras", step: "1" },
      { key: "precioBisagra", label: "Precio bisagra", suffix: "$", step: "100" },
      { key: "cerradura", label: "Cerradura", suffix: "$", step: "100" },
      { key: "picaporte", label: "Picaporte", suffix: "$", step: "100" },
      { key: "precioBurlete", label: "Precio burlete x metro", suffix: "$", step: "100" },
    ],
  },
  {
    titulo: "Otros insumos",
    icon: <PlusCircle className="size-4" />,
    campos: [
      {
        key: "porcentajeOtros",
        label: "Otros insumos (% del material)",
        suffix: "%",
        step: "0.5",
      },
    ],
  },
]

type Props = {
  valores: Parametros
  onChange: (key: keyof Parametros, value: number) => void
}

export function CamposCotizador({ valores, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {GRUPOS.map((grupo) => (
        <Card key={grupo.titulo} className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-primary">
              <span className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
                {grupo.icon}
              </span>
              {grupo.titulo}
              {grupo.subtitulo ? (
                <span className="text-xs font-normal text-muted-foreground">
                  {grupo.subtitulo}
                </span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {grupo.campos.map((campo) => (
                <div key={campo.key} className="flex flex-col gap-1.5">
                  <Label htmlFor={campo.key} className="text-sm font-medium">
                    {campo.label}
                    {campo.suffix ? (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        ({campo.suffix})
                      </span>
                    ) : null}
                  </Label>
                  <Input
                    id={campo.key}
                    type="number"
                    inputMode="decimal"
                    step={campo.step ?? "any"}
                    min={0}
                    value={Number.isNaN(valores[campo.key]) ? "" : valores[campo.key]}
                    onChange={(e) =>
                      onChange(campo.key, Number.parseFloat(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
