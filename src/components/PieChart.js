import React, { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(PieController, ArcElement, ChartDataLabels);

const labels = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const colors = ["#cfc", ...Array.from({ length: 25 }, () => "white")];

export function PieChart({ data }) {
  const canvas = useRef(null);

  useEffect(() => {
    const context = canvas.current.getContext("2d");

    /* exported myChart */
    const myChart = new Chart(context, {
      type: "pie",

      data: { datasets: [{ data }] },

      options: {
        rotation: 180,
        events: [],
        backgroundColor: colors,
        borderColor: "black",
        borderWidth: 1,
        responsive: true,
        animation: {
          duration: 2000,
          delay: 500,
          easing: "easeInOutCubic",
        },

        plugins: {
          datalabels: {
            color: "#black",
            font: {
              size: 100,
              family: "'Maxeville-Construct'", // needs both quotes
            },
            formatter(value, context) {
              return labels[context.dataIndex];
            },

            // hide unpopular responses
            display: (context) => {
              const value = context.dataset.data[context.dataIndex];
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              return value / total >= 0.1;
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  });

  return <canvas ref={canvas} width="400" height="400"></canvas>;
}
