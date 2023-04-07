import { Component, createSignal, For, Index, Show } from "solid-js";
import SleepyBoyMenu, {
  ActionMenuItem,
  GroupedItems,
  Menu,
} from "@/SleepyBoyMenu";
import { createShortcut } from "@solid-primitives/keyboard";
import { useCalendarData } from "./CalendarDataProvider";

const Softkeys: Component = () => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const {
    habits: {
      selectedHabit,
      setSelectedHabit,
      habitList,
      setShouldShowAddHabitPopup,
    },
    calendar: { increment, decrement },
  } = useCalendarData();

  const myMenu = (): Menu => {
    const habits: ActionMenuItem[] = habitList().map((habitName) => ({
      name: habitName,
      value: habitName,
      handler: () => setSelectedHabit(habitName),
    }));

    const habitGroup: GroupedItems = {
      groupName: "Select habit",
      items: habits,
    };

    return {
      items: [
        {
          name: "Create habit",
          value: "create-habit",
          handler: () => setShouldShowAddHabitPopup(true),
        },
        habitGroup,
      ],
    };
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
