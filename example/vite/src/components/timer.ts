import { NewElement, NewSignal, NewEffect } from "regular-framework/dev/browser";

import styles from "./timer.module.css";

export const NewTimer = () => {
  type State = "idle" | "running" | "paused" | "stopped";
  const state = NewSignal<State>("idle");
  const duration = NewSignal(0);
  NewEffect(() => {
    const tick = 100;
    if (state.value === "running") {
      const interval = setInterval(() => {
        duration.value = duration.value + tick;
      }, tick);
      return () => clearInterval(interval);
    }
  });
  const clearButton = NewElement(
    "button",
    {
      events(events) {
        if (events.type === "click") {
          duration.value = 0;
          state.value = "idle";
        }
      },
    },
    "Clear"
  );
  return NewElement(
    "div",
    {
      class: styles.timer,
    },
    NewElement("h2", {}, "Timer Component"),

    NewElement(
      "div",
      {},
      `Duration: `,
      NewElement("b", {}, () => duration.value / 1000, "s")
    ),
    NewElement(
      "div",
      {},
      NewElement(
        "button",
        {
          events(events) {
            if (events.type === "click") {
              switch (state.value) {
                case "idle":
                case "paused":
                  state.value = "running";
                  break;
                case "running":
                  state.value = "paused";
                  break;
              }
            }
          },
        },
        () => {
          switch (state.value) {
            case "idle":
              return "Start";
            case "paused":
              return "Resume";
            case "running":
              return "Pause";
            default:
              return "";
          }
        }
      ),
      () => (state.value === "paused" ? clearButton : "")
    )
  );
};
