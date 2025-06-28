import React from "react";
import { LegendData } from "./types";

interface OdometerLegendProps {
  readonly data: LegendData[];
}

export default function OdometerLegend({ data }: Readonly<OdometerLegendProps>) {
  return (
    <div className="flex flex-col gap-2 justify-center">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block w-4 h-4 rounded"
            style={{
              background: d.colorSolved,
              border: `2px solid ${d.colorUnsolved}`,
            }}
          ></span>
          <span className="font-medium w-16">{d.name}</span>
          <span className="text-xs text-gray-500">
            {d.solved} / {d.total}
          </span>
        </div>
      ))}
    </div>
  );
}
