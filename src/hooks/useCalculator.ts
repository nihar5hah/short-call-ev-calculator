import { useState, useCallback, useMemo } from "react";
import {
  type CalculationInputs,
  type CalculationResults,
  calculateEV,
} from "@/lib/calculations";

const DEFAULT_INPUTS: CalculationInputs = {
  spot: 22500,
  strike: 24000,
  premium: 32,
  iv: 45.31,
  days: 9,
  lotSize: 65,
  lots: 1,
  zTail: 4,
};

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculationInputs>(DEFAULT_INPUTS);

  const updateInput = useCallback(
    <K extends keyof CalculationInputs>(key: K, value: CalculationInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const results: CalculationResults = useMemo(() => {
    return calculateEV(inputs);
  }, [inputs]);

  return {
    inputs,
    results,
    updateInput,
  };
}
