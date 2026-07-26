import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import data from '@site/src/data/od600.json';

// Real chart from a data file (src/data/od600.json) via recharts.
// recharts measures the DOM, so it must run in the browser only — hence
// BrowserOnly + require() instead of a top-level import (which would crash SSR).
export default function GrowthChart() {
  return (
    <BrowserOnly fallback={<div>Loading chart…</div>}>
      {() => {
        const {
          ResponsiveContainer,
          LineChart,
          Line,
          XAxis,
          YAxis,
          CartesianGrid,
          Tooltip,
          Legend,
        } = require('recharts');
        return (
          <div style={{width: '100%', height: 320}}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{top: 8, right: 16, bottom: 8, left: 0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,236,247,0.15)" />
                <XAxis
                  dataKey="time"
                  stroke="#E8ECF7"
                  label={{value: 'time (h)', position: 'insideBottom', offset: -4, fill: '#E8ECF7'}}
                />
                <YAxis
                  stroke="#E8ECF7"
                  label={{value: 'OD₆₀₀', angle: -90, position: 'insideLeft', fill: '#E8ECF7'}}
                />
                <Tooltip
                  contentStyle={{background: '#0C1036', border: '1px solid #F0C581', borderRadius: 8}}
                />
                <Legend />
                <Line type="monotone" dataKey="wt" name="Wild-type" stroke="#F0C581" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="mutant" name="ΔsensorR" stroke="#2EA043" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      }}
    </BrowserOnly>
  );
}
