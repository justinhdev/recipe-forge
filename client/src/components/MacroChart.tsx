import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type MacroChartProps = { protein: number; fat: number; carbs: number };

const COLORS = {
  Protein: "#3B82F6",
  Fat: "#EF4444",
  Carbs: "#10B981",
} as const;

function MacroChartInner({ protein, fat, carbs }: MacroChartProps) {
  const data = useMemo(
    () => [
      { name: "Protein", value: protein },
      { name: "Fat", value: fat },
      { name: "Carbs", value: carbs },
    ],
    [protein, fat, carbs]
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="h-[250px] w-full sm:h-[350px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="62%"
              innerRadius={20}
              label={({ value }) => `${value}g`}
              labelLine={false}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}g`, name]}
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "0.5rem",
                color: "white",
              }}
              itemStyle={{ color: "inherit", fontWeight: 500 }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default React.memo(MacroChartInner);
