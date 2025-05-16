'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const defaultValues = {
  temperature: 15.2,
  humidite: 72,
  force_moyenne_du_vecteur_de_vent: 4.3,
  force_du_vecteur_de_vent_max: 7.8,
  pluie_intensite_max: 1.9,
  sismicite: 0.12,
  concentration_gaz: 120,
  pluie_totale: 12.5,
  quartier: 'Zone 2',
}

export default function ProbabiltyPage() {
  const [values, setValues] = useState(defaultValues)
  const [riskLevel, setRiskLevel] = useState<string | null>(null)

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const calculateRisk = () => {
    const { sismicite, force_du_vecteur_de_vent_max, concentration_gaz } = values
    const riskScore =
      sismicite * 100 + force_du_vecteur_de_vent_max * 2 + concentration_gaz / 10
    if (riskScore > 40) setRiskLevel('⚠️ Risque élevé de séisme')
    else if (riskScore > 20) setRiskLevel('⚠️ Risque modéré de séisme')
    else setRiskLevel('✅ Faible risque de séisme')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Analyse de risque sismique</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(values).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm font-medium capitalize block mb-1">
              {key.replaceAll('_', ' ')}
            </label>
            <Input
              type={typeof value === 'number' ? 'number' : 'text'}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <Button onClick={calculateRisk}>Analyser le risque</Button>

      {riskLevel && (
        <Card className="mt-6 p-4 text-lg font-semibold">
          Résultat : {riskLevel}
        </Card>
      )}
    </div>
  )
}
