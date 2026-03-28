import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useCalculator } from "@/hooks/useCalculator";
import {
  formatINR,
  formatIndianNumber,
  formatPercent,
} from "@/lib/calculations";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
};

interface InputFieldProps {
  label: string;
  hint?: string;
  prefix: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  formatValue?: boolean;
}

function InputField({
  label,
  hint,
  prefix,
  value,
  onChange,
  min,
  max,
  step = 1,
  showSlider,
  sliderMin,
  sliderMax,
  formatValue = false,
}: InputFieldProps) {
  const displayValue = formatValue
    ? formatIndianNumber(value)
    : value.toString();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    const num = parseFloat(raw) || 0;
    onChange(num);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </Label>
        {hint && (
          <span className="text-[10px] text-muted-foreground/60">{hint}</span>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-muted-foreground">
          {prefix}
        </span>
        <Input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          className="pl-8 font-mono text-sm bg-background border-border/50 h-10 focus:border-muted-foreground/50 transition-colors"
        />
      </div>
      {showSlider && (
        <Slider
          value={[value]}
          onValueChange={(v) => {
            const arr = Array.isArray(v) ? v : [v];
            onChange(arr[0] ?? value);
          }}
          min={sliderMin ?? min}
          max={sliderMax ?? max}
          step={step}
          className="mt-2"
        />
      )}
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string;
  color?: "profit" | "loss" | "neutral" | "warning" | "default";
}

function StatRow({ label, value, color = "default" }: StatRowProps) {
  const colorClasses = {
    profit: "text-profit",
    loss: "text-loss",
    neutral: "text-neutral-blue",
    warning: "text-warning",
    default: "text-foreground",
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-b-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className={cn("font-mono text-sm tabular-nums", colorClasses[color])}>
        {value}
      </span>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  variant?: "profit" | "loss" | "neutral";
  large?: boolean;
}

function MetricCard({
  label,
  value,
  variant = "neutral",
  large = false,
}: MetricCardProps) {
  const bgClasses = {
    profit: "bg-profit-subtle border-profit",
    loss: "bg-loss-subtle border-loss",
    neutral: "bg-muted/30 border-border",
  };

  const textClasses = {
    profit: "text-profit",
    loss: "text-loss",
    neutral: "text-foreground",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
      className={cn(
        "rounded-md border p-4 transition-colors",
        bgClasses[variant]
      )}
    >
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </div>
      <div
        className={cn(
          "font-mono tabular-nums font-semibold",
          large ? "text-2xl" : "text-lg",
          textClasses[variant]
        )}
      >
        {value}
      </div>
    </motion.div>
  );
}

function SigmaChip({
  level,
  price,
}: {
  level: number;
  price: number;
}) {
  const colors = {
    1: "text-profit border-profit/30 bg-profit/5",
    2: "text-warning border-warning/30 bg-warning/5",
    3: "text-loss border-loss/30 bg-loss/5",
    4: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border",
        colors[level as keyof typeof colors]
      )}
    >
      <span className="font-semibold">{level}σ</span>
      <span className="text-muted-foreground">=</span>
      <span>₹{formatIndianNumber(price)}</span>
    </motion.div>
  );
}

export function Calculator() {
  const { inputs, results, updateInput } = useCalculator();

  const isPositiveEV = results.ev >= 0;

  return (
    <div className="min-h-screen bg-background bg-grid">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border/50 bg-card/50 text-xs uppercase tracking-widest text-muted-foreground mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
            Options Analytics
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-3">
            Short Call{" "}
            <span className="text-muted-foreground font-normal">EV Model</span>
          </h1>
          <p className="text-sm text-muted-foreground tracking-wide">
            Tail Risk · Expected Value · Probability Analysis
          </p>
        </motion.header>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 auto-rows-fr"
        >
          {/* Market Inputs */}
          <motion.div variants={item} className="flex">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm w-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  <Target className="w-4 h-4" />
                  Market Inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 flex-1">
                <InputField
                  label="Spot Price"
                  hint="Current index"
                  prefix="₹"
                  value={inputs.spot}
                  onChange={(v) => updateInput("spot", v)}
                  formatValue
                />
                <InputField
                  label="Strike Price"
                  hint="OTM level"
                  prefix="₹"
                  value={inputs.strike}
                  onChange={(v) => updateInput("strike", v)}
                  formatValue
                />
                <InputField
                  label="Premium Received"
                  hint="Per unit"
                  prefix="₹"
                  value={inputs.premium}
                  onChange={(v) => updateInput("premium", v)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Position & Volatility */}
          <motion.div variants={item} className="flex">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm w-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  <Activity className="w-4 h-4" />
                  Position & Volatility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 flex-1">
                <InputField
                  label="Implied Volatility"
                  hint="Annual %"
                  prefix="%"
                  value={inputs.iv}
                  onChange={(v) => updateInput("iv", v)}
                  showSlider
                  sliderMin={5}
                  sliderMax={150}
                  step={0.5}
                />
                <InputField
                  label="Days to Expiry"
                  hint="Calendar days"
                  prefix="D"
                  value={inputs.days}
                  onChange={(v) => updateInput("days", v)}
                  showSlider
                  sliderMin={1}
                  sliderMax={90}
                  step={1}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Lot Size"
                    prefix="#"
                    value={inputs.lotSize}
                    onChange={(v) => updateInput("lotSize", v)}
                  />
                  <InputField
                    label="Lots"
                    prefix="×"
                    value={inputs.lots}
                    onChange={(v) => updateInput("lots", v)}
                  />
                </div>
                <InputField
                  label="Tail Cutoff"
                  hint="Worst-case σ"
                  prefix="σ"
                  value={inputs.zTail}
                  onChange={(v) => updateInput("zTail", v)}
                  showSlider
                  sliderMin={1}
                  sliderMax={6}
                  step={0.5}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Volatility Output */}
          <motion.div variants={item} className="flex">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm w-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Volatility Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-0">
                  <StatRow
                    label="1σ Move"
                    value={`± ${formatIndianNumber(Math.round(results.oneSigma))}`}
                    color="neutral"
                  />
                  <StatRow
                    label="Tail Cutoff"
                    value={`${inputs.zTail}σ cutoff`}
                    color="warning"
                  />
                  <StatRow
                    label="Tail Price"
                    value={formatINR(Math.round(results.tailPrice))}
                    color="warning"
                  />
                  <StatRow
                    label="Z-Score (Strike)"
                    value={results.zScore.toFixed(3)}
                    color="neutral"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-5">
                  {results.sigmaLevels.map(({ level, price }) => (
                    <SigmaChip key={level} level={level} price={price} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Probabilities & Payoffs */}
          <motion.div variants={item} className="flex">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm w-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  <Layers className="w-4 h-4" />
                  Probabilities & Payoffs
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-0">
                  <StatRow
                    label="Full Profit Prob."
                    value={formatPercent(results.probProfit * 100)}
                    color="profit"
                  />
                  <StatRow
                    label="Loss Probability"
                    value={formatPercent(results.probLoss * 100)}
                    color="loss"
                  />
                  <StatRow
                    label="Units (Lot × Lots)"
                    value={`${results.units.toLocaleString("en-IN")} units`}
                    color="neutral"
                  />
                  <StatRow
                    label="Max Profit"
                    value={formatINR(results.maxProfit)}
                    color="profit"
                  />
                  <StatRow
                    label="Tail Max Loss"
                    value={formatINR(Math.round(results.maxLoss))}
                    color="loss"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* EV Summary - Spans 2 columns on the bottom row */}
          <motion.div variants={fadeInScale} className="lg:col-span-2 flex">
            <Card
              className={cn(
                "border backdrop-blur-sm transition-colors duration-500 w-full flex flex-col",
                isPositiveEV
                  ? "bg-profit/[0.03] border-profit/20"
                  : "bg-loss/[0.03] border-loss/20"
              )}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  <Clock className="w-4 h-4" />
                  Expected Value Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  <MetricCard
                    label="EV per Trade"
                    value={formatINR(Math.round(results.ev))}
                    variant={isPositiveEV ? "profit" : "loss"}
                    large
                  />
                  <MetricCard
                    label="Max Profit"
                    value={formatINR(results.maxProfit)}
                    variant="profit"
                  />
                  <MetricCard
                    label="Tail Max Loss"
                    value={formatINR(Math.round(Math.abs(results.maxLoss)))}
                    variant="loss"
                  />
                  <MetricCard
                    label="Profit Probability"
                    value={formatPercent(results.probProfit * 100)}
                    variant="neutral"
                  />
                  <MetricCard
                    label="Loss Probability"
                    value={formatPercent(results.probLoss * 100)}
                    variant={results.probLoss > 0.3 ? "loss" : "neutral"}
                  />
                  <MetricCard
                    label="Profit : Loss Ratio"
                    value={`1 : ${results.ratio.toFixed(2)}`}
                    variant="neutral"
                  />
                </div>

                {/* Probability Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                    <span>Loss Side</span>
                    <span>
                      Profit Prob: {formatPercent(results.probProfit * 100)}
                    </span>
                    <span>Profit Side</span>
                  </div>
                  <div className="h-2 rounded-full bg-loss/20 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-muted-foreground/50 to-profit"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.max(0, Math.min(100, results.probProfit * 100))}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Verdict */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm font-medium",
                    isPositiveEV
                      ? "bg-profit/10 border-profit/30 text-profit"
                      : "bg-loss/10 border-loss/30 text-loss"
                  )}
                >
                  {isPositiveEV ? (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      POSITIVE EV TRADE — Expected to be profitable
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4" />
                      NEGATIVE EV TRADE — Expected to be unprofitable
                    </>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10 py-6 border-t border-border/30"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 uppercase tracking-widest">
            <AlertTriangle className="w-3 h-3" />
            Short Call EV Model · Tail Risk Analysis · For informational
            purposes only
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
