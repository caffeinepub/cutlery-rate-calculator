import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, Trash2, UtensilsCrossed } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useId, useState } from "react";

interface CutleryItem {
  id: string;
  name: string;
  weight: string;
}

const DEFAULT_ITEMS: CutleryItem[] = [
  { id: "1", name: "Tea Spoon", weight: "270" },
  { id: "2", name: "Dessert Spoon", weight: "430" },
  { id: "3", name: "Table Spoon", weight: "520" },
  { id: "4", name: "Knife", weight: "440" },
  { id: "5", name: "Dessert Fork", weight: "330" },
];

const CHART_POINTS: { x: number; y: number }[] = [
  { x: 0, y: 60 },
  { x: 30, y: 48 },
  { x: 60, y: 52 },
  { x: 90, y: 30 },
  { x: 120, y: 35 },
  { x: 150, y: 18 },
  { x: 180, y: 10 },
];

const CUTLERY_ICONS: { icon: string; label: string }[] = [
  { icon: "🥄", label: "Spoon" },
  { icon: "🍴", label: "Fork" },
  { icon: "🔪", label: "Knife" },
];

function HeroIllustration() {
  return (
    <div className="relative w-full h-72 lg:h-96 flex items-center justify-center">
      {/* Background arc shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary/10" />
        <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-primary/6" />
      </div>
      {/* Chart card */}
      <div className="relative z-10 bg-card border border-border rounded-xl shadow-card p-4 w-56">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Rate Overview
        </p>
        <svg viewBox="0 0 180 80" className="w-full" aria-hidden="true">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="oklch(0.51 0.12 240)"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="oklch(0.51 0.12 240)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <path
            d="M0,60 L30,48 L60,52 L90,30 L120,35 L150,18 L180,10"
            fill="none"
            stroke="oklch(0.51 0.12 240)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0,60 L30,48 L60,52 L90,30 L120,35 L150,18 L180,10 L180,80 L0,80 Z"
            fill="url(#chartGrad)"
          />
          {CHART_POINTS.map((pt) => (
            <circle
              key={`pt-${pt.x}`}
              cx={pt.x}
              cy={pt.y}
              r="3"
              fill="oklch(0.51 0.12 240)"
            />
          ))}
        </svg>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">₹290/kg</span>
          <span className="text-xs font-bold text-primary">₹300/kg</span>
        </div>
      </div>
      {/* Cutlery icons floating */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        {CUTLERY_ICONS.map(({ icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
            className="w-12 h-12 bg-card border border-border rounded-lg shadow-xs flex items-center justify-center text-xl"
            aria-label={label}
          >
            {icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [baseThickness, setBaseThickness] = useState("125");
  const [threshold, setThreshold] = useState("200");
  const [rateBelow, setRateBelow] = useState("290");
  const [rateAbove, setRateAbove] = useState("300");
  const [targetThickness, setTargetThickness] = useState("150");
  const [items, setItems] = useState<CutleryItem[]>(DEFAULT_ITEMS);
  const [newName, setNewName] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const formId = useId();

  const addItem = useCallback(() => {
    if (!newName.trim() && !newWeight.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newName, weight: newWeight },
    ]);
    setNewName("");
    setNewWeight("");
  }, [newName, newWeight]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  // Calculations
  const base = Number.parseFloat(baseThickness) || 0;
  const thresh = Number.parseFloat(threshold) || 0;
  const below = Number.parseFloat(rateBelow) || 0;
  const above = Number.parseFloat(rateAbove) || 0;
  const target = Number.parseFloat(targetThickness) || 0;

  const ratePerKg = target < thresh ? below : above;
  const factor = base > 0 ? target / base : 0;

  const results = items
    .filter((item) => item.name && Number.parseFloat(item.weight) > 0)
    .map((item) => {
      const weight = Number.parseFloat(item.weight) || 0;
      const adjustedWeight = weight * factor;
      const ratePerDozen = (adjustedWeight / 1000) * ratePerKg;
      return { ...item, adjustedWeight, ratePerDozen };
    });

  const totalRate = results.reduce((sum, r) => sum + r.ratePerDozen, 0);

  const scrollToCalculator = () => {
    document
      .getElementById("calculator")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Cutlery
              </p>
              <p className="text-xs font-bold text-foreground uppercase tracking-wide -mt-0.5">
                Rate Calculator
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {["Home", "Features", "How It Works", "Contact"].map((link) => (
              <a
                key={link}
                href="/"
                data-ocid={`nav.${link.toLowerCase().replace(/ /g, "_")}.link`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <Button
            onClick={scrollToCalculator}
            size="sm"
            data-ocid="header.start_calculating.button"
            className="shrink-0"
          >
            Start Calculating
          </Button>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/60 to-background py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Professional Tool
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
              Precise Cutlery
              <br />
              <span className="text-primary">Pricing, Instantly</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
              Calculate accurate per-dozen rates for any cutlery item based on
              thickness, weight, and material costs — all in real time.
            </p>
            <Button
              onClick={scrollToCalculator}
              size="lg"
              data-ocid="hero.get_started.button"
              className="gap-2"
            >
              Get Started Now <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* ─── Calculator ─── */}
      <section id="calculator" className="py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Section heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-foreground mb-2">
              Calculate Your Rates
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Enter your parameters and item details below. Rates update
              instantly as you type.
            </p>
          </div>

          {/* 2-column grid: Input Params + Items */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* ── Input Parameters Card ── */}
            <div
              className="bg-card border border-border rounded-xl shadow-card p-6"
              data-ocid="params.card"
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-5">
                Step 1 — Input Parameters
              </p>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor={`${formId}-base`}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Base Thickness
                  </Label>
                  <Input
                    id={`${formId}-base`}
                    type="number"
                    value={baseThickness}
                    onChange={(e) => setBaseThickness(e.target.value)}
                    className="mt-1"
                    data-ocid="params.base_thickness.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`${formId}-threshold`}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Threshold
                  </Label>
                  <Input
                    id={`${formId}-threshold`}
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="mt-1"
                    data-ocid="params.threshold.input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor={`${formId}-below`}
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      Rate Below (₹/kg)
                    </Label>
                    <Input
                      id={`${formId}-below`}
                      type="number"
                      value={rateBelow}
                      onChange={(e) => setRateBelow(e.target.value)}
                      className="mt-1"
                      data-ocid="params.rate_below.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor={`${formId}-above`}
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      Rate Above (₹/kg)
                    </Label>
                    <Input
                      id={`${formId}-above`}
                      type="number"
                      value={rateAbove}
                      onChange={(e) => setRateAbove(e.target.value)}
                      className="mt-1"
                      data-ocid="params.rate_above.input"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor={`${formId}-target`}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Target Thickness
                  </Label>
                  <Input
                    id={`${formId}-target`}
                    type="number"
                    value={targetThickness}
                    onChange={(e) => setTargetThickness(e.target.value)}
                    className="mt-1"
                    data-ocid="params.target_thickness.input"
                  />
                </div>

                {/* Rate indicator */}
                <div className="mt-2 p-3 rounded-lg bg-secondary border border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Active Rate
                  </span>
                  <span className="text-sm font-bold text-primary">
                    ₹{ratePerKg}/kg
                  </span>
                </div>
              </div>
            </div>

            {/* ── Cutlery Items Card ── */}
            <div
              className="bg-card border border-border rounded-xl shadow-card p-6"
              data-ocid="items.card"
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-5">
                Step 2 — Cutlery Items
              </p>

              {/* Add new item row */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Item name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  className="flex-1"
                  data-ocid="items.name.input"
                />
                <Input
                  type="number"
                  placeholder="Weight (g)"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  className="w-32"
                  data-ocid="items.weight.input"
                />
                <Button
                  onClick={addItem}
                  data-ocid="items.add_item.button"
                  className="shrink-0"
                >
                  + Add
                </Button>
              </div>

              {/* Items list */}
              <div className="space-y-2 mb-4" data-ocid="items.list">
                <AnimatePresence initial={false}>
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex gap-2 items-center"
                      data-ocid={`items.item.${idx + 1}`}
                    >
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? { ...i, name: e.target.value }
                                : i,
                            ),
                          )
                        }
                        placeholder="Item name"
                        className="flex-1 text-sm"
                      />
                      <Input
                        type="number"
                        value={item.weight}
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? { ...i, weight: e.target.value }
                                : i,
                            ),
                          )
                        }
                        placeholder="g/doz"
                        className="w-28 text-sm"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        data-ocid={`items.delete_button.${idx + 1}`}
                        aria-label={`Remove ${item.name}`}
                        className="shrink-0 h-9 w-9"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {items.length === 0 && (
                  <div
                    className="text-center py-8 text-muted-foreground text-sm"
                    data-ocid="items.empty_state"
                  >
                    No items yet. Add some cutlery items above.
                  </div>
                )}
              </div>

              {/* Clear all */}
              {items.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearAll}
                  data-ocid="items.clear_all.button"
                  className="w-full"
                >
                  Clear All Items
                </Button>
              )}
            </div>
          </div>

          {/* ── Results Card (full width) ── */}
          <div
            className="bg-card border border-border rounded-xl shadow-card overflow-hidden"
            data-ocid="results.card"
          >
            <div className="px-6 py-4 border-b border-border">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                Step 3 — Calculated Results
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Factor: {factor.toFixed(4)} &nbsp;·&nbsp; Rate: ₹{ratePerKg}/kg
              </p>
            </div>

            {results.length > 0 ? (
              <Table data-ocid="results.table">
                <TableHeader>
                  <TableRow className="bg-secondary hover:bg-secondary">
                    <TableHead className="font-bold text-foreground text-xs uppercase tracking-wide">
                      Cutlery Item
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-xs uppercase tracking-wide text-right">
                      Weight (g/doz)
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-xs uppercase tracking-wide text-right">
                      Adjusted Weight
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-xs uppercase tracking-wide text-right">
                      ₹/Dozen
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r, idx) => (
                    <TableRow
                      key={r.id}
                      data-ocid={`results.row.${idx + 1}`}
                      className="hover:bg-secondary/40 transition-colors"
                    >
                      <TableCell className="font-medium text-sm">
                        {r.name}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {r.weight}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {r.adjustedWeight.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold text-foreground">
                        ₹ {r.ratePerDozen.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Summary row */}
                  <TableRow
                    className="bg-secondary border-t-2 border-border"
                    data-ocid="results.summary.row"
                  >
                    <TableCell
                      colSpan={3}
                      className="font-bold text-sm text-foreground"
                    >
                      Total ₹/Dozen
                    </TableCell>
                    <TableCell className="text-right font-extrabold text-primary text-base">
                      ₹ {totalRate.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <div
                className="py-12 text-center text-muted-foreground text-sm"
                data-ocid="results.empty_state"
              >
                Add cutlery items with valid names and weights to see results.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-card border-t border-border mt-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                <UtensilsCrossed className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm text-foreground">
                Cutlery Rate Calculator
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A professional tool for calculating precise per-dozen cutlery
              pricing based on thickness ratios and material rates.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Quick Links
            </p>
            <ul className="space-y-2">
              {["Home", "Calculator", "How It Works", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="/"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Contact
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>info@cutleryrates.com</li>
              <li>+91 98765 43210</li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              © {year}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Built with ❤️ using caffeine.ai
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              Copyright {year} · Cutlery Rate Calculator
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
