# Short Call EV Calculator

A sophisticated Expected Value (EV) calculator for short call options positions. Built for options traders to analyze risk/reward and tail risk scenarios.

## Features

- **Real-time EV Calculation**: Instant computation as you adjust parameters
- **Tail Risk Analysis**: Configure worst-case scenarios with customizable Z-sigma cutoffs
- **Probability Analysis**: Visual breakdown of profit/loss probabilities using normal distribution
- **Indian Market Ready**: INR formatting with Indian number system (lakhs/crores)
- **Professional UI**: Clean, financial terminal-inspired design

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **Framer Motion** for animations

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Input Parameters

| Parameter | Description |
|-----------|-------------|
| Spot Price | Current index/stock price |
| Strike Price | OTM strike for short call |
| Premium Received | Premium collected per unit |
| Implied Volatility | Annual IV percentage |
| Days to Expiry | Calendar days until expiration |
| Lot Size x Lots | Position size calculation |
| Tail Cutoff (Z-sigma) | Worst-case sigma level for loss calculation |

### Output Metrics

- **1 sigma Move**: Expected one standard deviation price movement
- **Z-Score**: Number of standard deviations to strike
- **Probability of Profit/Loss**: Based on normal distribution
- **Max Profit**: Premium x Units
- **Tail Max Loss**: Loss at specified Z-sigma level
- **EV per Trade**: Expected value considering probabilities

## Calculation Methodology

The calculator uses a simplified Black-Scholes framework:

1. **Volatility Scaling**: `sigma_period = IV x sqrt(days/365)`
2. **Z-Score**: `z = (Strike - Spot) / sigma_period`
3. **Probabilities**: Using cumulative normal distribution (CDF)
4. **EV**: `P(profit) x MaxProfit - P(loss) x TailLoss`

## License

MIT
