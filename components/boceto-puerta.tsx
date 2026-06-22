"use client"

import type { Parametros, Resultado } from "@/lib/cotizador"

type Props = {
  parametros: Parametros
  resultado: Resultado
}

export function BocetoPuerta({ parametros: p, resultado: r }: Props) {
  const tienePano =
    Boolean(p.panoFijoEnabled) && p.panoFijoAncho > 0 && p.panoFijoAlto > 0
  const tieneRev = p.revAncho > 0 && p.revAlto > 0
  const tienePanoRev = tienePano && Boolean(p.panoFijoRevEnabled) && r.costoPanoFijoRev > 0

  // Separación visual entre puerta y paño fijo (5 cm)
  const gap = tienePano ? 0.05 : 0

  const anchoTotal = p.ancho + (tienePano ? p.panoFijoAncho + gap : 0)
  const altoTotal = Math.max(p.alto, tienePano ? p.panoFijoAlto : 0)

  // Escala para que el dibujo entre cómodo en el viewBox
  const escala = anchoTotal > 0 && altoTotal > 0 ? 320 / Math.max(anchoTotal, altoTotal) : 100

  const margenIzq = 56
  const margenDer = 24
  const margenSup = 36
  const margenInf = 48

  const anchoSvg = anchoTotal * escala + margenIzq + margenDer
  const altoSvg = altoTotal * escala + margenSup + margenInf

  // Línea base inferior (la puerta y el paño "apoyan" abajo)
  const baseY = margenSup + altoTotal * escala

  // Marco
  const marco = 6

  // ---- Puerta ----
  const puertaX = margenIzq
  const puertaW = p.ancho * escala
  const puertaH = p.alto * escala
  const puertaY = baseY - puertaH

  // Interior de la puerta (descontando el marco)
  const intX = puertaX + marco
  const intY = puertaY + marco
  const intW = puertaW - marco * 2
  const intH = puertaH - marco * 2

  // Zona de revestimiento (arriba, centrado horizontalmente)
  const revH = tieneRev ? Math.min(p.revAlto, p.alto) * escala - marco : 0
  const revWReal = Math.min(p.revAncho, p.ancho)
  const revW = tieneRev ? Math.max(0, revWReal * escala - marco) : 0
  const revX = intX + (intW - revW) / 2
  const revY = intY

  // Zona de tablillas (debajo del revestimiento)
  const tablillaY = tieneRev ? revY + revH + 4 : intY
  const tablillaH = Math.max(0, baseY - marco - tablillaY)

  // Cantidad de tablillas a dibujar (limitado para que se vea bien)
  const numTablillas =
    p.anchoTablilla > 0 ? Math.max(1, Math.min(24, Math.round(intW / (p.anchoTablilla * escala)))) : 0

  // Travesaños horizontales sobre el área de tablillas
  const numTravesanos = Math.max(0, Math.min(8, p.cantTravesanos))

  // ---- Paño fijo ----
  const panoX = puertaX + (p.ancho + gap) * escala
  const panoW = tienePano ? p.panoFijoAncho * escala : 0
  const panoH = tienePano ? p.panoFijoAlto * escala : 0
  const panoY = baseY - panoH

  const panoIntX = panoX + marco
  const panoIntY = panoY + marco
  const panoIntW = panoW - marco * 2
  const panoIntH = panoH - marco * 2

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Boceto técnico
          </p>
          <p className="text-xs text-muted-foreground">
            Esquema ilustrativo · medidas en metros
          </p>
        </div>
        <p className="font-mono text-sm font-medium tabular-nums text-foreground">
          {p.ancho} × {p.alto} m
        </p>
      </div>

      <div className="overflow-x-auto py-4">
        <svg
          viewBox={`0 0 ${anchoSvg} ${altoSvg}`}
          className="mx-auto h-auto w-full max-w-[460px]"
          role="img"
          aria-label="Boceto técnico de la puerta con sus medidas y componentes"
        >
          <defs>
            <pattern
              id="vidrio"
              width="8"
              height="8"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                className="stroke-primary/30"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {/* ===== PUERTA ===== */}
          {/* Marco exterior */}
          <rect
            x={puertaX}
            y={puertaY}
            width={puertaW}
            height={puertaH}
            rx="2"
            className="fill-muted stroke-foreground"
            strokeWidth={marco}
          />
          {/* Interior */}
          <rect
            x={intX}
            y={intY}
            width={intW}
            height={intH}
            className="fill-card"
          />

          {/* Tablillas verticales */}
          {numTablillas > 0 &&
            tablillaH > 0 &&
            Array.from({ length: numTablillas }).map((_, i) => {
              const x = intX + ((i + 1) * intW) / (numTablillas + 1)
              return (
                <line
                  key={`tab-${i}`}
                  x1={x}
                  y1={tablillaY}
                  x2={x}
                  y2={baseY - marco}
                  className="stroke-muted-foreground/40"
                  strokeWidth="1"
                />
              )
            })}

          {/* Travesaños horizontales */}
          {numTravesanos > 0 &&
            tablillaH > 0 &&
            Array.from({ length: numTravesanos }).map((_, i) => {
              const y = tablillaY + ((i + 1) * tablillaH) / (numTravesanos + 1)
              return (
                <line
                  key={`trav-${i}`}
                  x1={intX}
                  y1={y}
                  x2={intX + intW}
                  y2={y}
                  className="stroke-foreground/50"
                  strokeWidth="2"
                />
              )
            })}

          {/* Revestimiento */}
          {tieneRev && revH > 0 && revW > 0 && (
            <>
              <rect
                x={revX}
                y={revY}
                width={revW}
                height={revH}
                className="fill-[url(#vidrio)] stroke-primary"
                strokeWidth="1.5"
              />
              <text
                x={revX + revW / 2}
                y={revY + revH / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-primary text-[9px] font-medium"
              >
                Revestimiento
              </text>
            </>
          )}

          {/* Picaporte / manija (lado del batiente) */}
          <circle
            cx={intX + intW - 8}
            cy={puertaY + puertaH / 2}
            r="3"
            className="fill-foreground"
          />

          {/* ===== PAÑO FIJO ===== */}
          {tienePano && (
            <>
              <rect
                x={panoX}
                y={panoY}
                width={panoW}
                height={panoH}
                rx="2"
                className="fill-muted stroke-foreground"
                strokeWidth={marco}
              />
              <rect
                x={panoIntX}
                y={panoIntY}
                width={panoIntW}
                height={panoIntH}
                className={tienePanoRev ? "fill-[url(#vidrio)]" : "fill-card"}
              />
              <text
                x={panoIntX + panoIntW / 2}
                y={panoIntY + panoIntH / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[9px] font-medium"
              >
                Paño fijo
              </text>
            </>
          )}

          {/* ===== COTAS / MEDIDAS ===== */}
          {/* Alto (izquierda de la puerta) */}
          <line
            x1={puertaX - 14}
            y1={puertaY}
            x2={puertaX - 14}
            y2={baseY}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <line
            x1={puertaX - 18}
            y1={puertaY}
            x2={puertaX - 10}
            y2={puertaY}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <line
            x1={puertaX - 18}
            y1={baseY}
            x2={puertaX - 10}
            y2={baseY}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <text
            x={puertaX - 22}
            y={puertaY + puertaH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90 ${puertaX - 22} ${puertaY + puertaH / 2})`}
            className="fill-foreground text-[10px] font-medium"
          >
            {p.alto} m
          </text>

          {/* Ancho (debajo de la puerta) */}
          <line
            x1={puertaX}
            y1={baseY + 14}
            x2={puertaX + puertaW}
            y2={baseY + 14}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <line
            x1={puertaX}
            y1={baseY + 10}
            x2={puertaX}
            y2={baseY + 18}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <line
            x1={puertaX + puertaW}
            y1={baseY + 10}
            x2={puertaX + puertaW}
            y2={baseY + 18}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <text
            x={puertaX + puertaW / 2}
            y={baseY + 30}
            textAnchor="middle"
            className="fill-foreground text-[10px] font-medium"
          >
            {p.ancho} m
          </text>

          {/* Cotas del paño fijo */}
          {tienePano && (
            <>
              <line
                x1={panoX}
                y1={baseY + 14}
                x2={panoX + panoW}
                y2={baseY + 14}
                className="stroke-muted-foreground"
                strokeWidth="1"
              />
              <line
                x1={panoX}
                y1={baseY + 10}
                x2={panoX}
                y2={baseY + 18}
                className="stroke-muted-foreground"
                strokeWidth="1"
              />
              <line
                x1={panoX + panoW}
                y1={baseY + 10}
                x2={panoX + panoW}
                y2={baseY + 18}
                className="stroke-muted-foreground"
                strokeWidth="1"
              />
              <text
                x={panoX + panoW / 2}
                y={baseY + 30}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-medium"
              >
                {p.panoFijoAncho} m
              </text>
              <text
                x={panoX + panoW + 4}
                y={panoY + panoH / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(-90 ${panoX + panoW + 4} ${panoY + panoH / 2})`}
                className="fill-foreground text-[9px] font-medium"
              >
                {p.panoFijoAlto} m
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Referencias */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm border-2 border-foreground bg-muted" />
          Marco
        </span>
        {r.metrosTablilla > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 border-l-2 border-r-2 border-muted-foreground/40" />
            Tablillas ({r.cantidadTablillas} u)
          </span>
        )}
        {p.cantTravesanos > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 border-t-2 border-b-2 border-foreground/50" />
            Travesaños ({p.cantTravesanos} u)
          </span>
        )}
        {tieneRev && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm border border-primary bg-primary/20" />
            Revestimiento
          </span>
        )}
        {tienePano && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm border-2 border-foreground bg-muted" />
            Paño fijo
          </span>
        )}
      </div>
    </div>
  )
}
