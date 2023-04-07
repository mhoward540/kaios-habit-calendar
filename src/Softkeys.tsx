import { Component, createSignal, For, Index, Show } from "solid-js";
import SleepyBoyMenu, { ActionMenuItem, Menu } from "@/SleepyBoyMenu";
import { createShortcut } from "@solid-primitives/keyboard";
import { useCalendarData } from "./CalendarDataProvider";

const Softkeys: Component = () => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const {
    habits: { selectedHabit, setSelectedHabit, habitList },
    calendar: { increment, decrement },
  } = useCalendarData();

  const myMenu = () => {
    const habits: ActionMenuItem[] = habitList().map((habitName) => ({
      name: `Select habit: ${habitName}`,
      value: habitName,
      handler: () => {
        console.log(`Selected ${habitName}`);
        setSelectedHabit(habitName);
      },
    }));

    return {
      items: [
        ...habits,
        {
          name: "Toggle Dark Mode",
          handler: () => {
            console.log("Toggled dark mode");
          },
        },
      ],
    } as Menu;
  };

  createShortcut(["3"], increment, {
    preventDefault: false,
    requireReset: true,
  });

  createShortcut(["1"], decrement, {
    preventDefault: false,
    requireReset: true,
  });

  createShortcut(
    ["SOFTRIGHT"],
    () => {
      setIsMenuOpen(true);
    },
    { requireReset: true }
  );

  return (
    <>
      <div class="softkeys">
        <div class="softkey softkey-left">options</div>
        <div class="softkey softkey-center">select</div>
        <div class="softkey softkey-right">habits</div>
      </div>
      <Show when={isMenuOpen()}>
        <SleepyBoyMenu
          selected={selectedHabit()}
          menu={myMenu()}
          handleClose={() => setIsMenuOpen(false)}
        />
      </Show>
    </>
  );
};

export default Softkeys;
