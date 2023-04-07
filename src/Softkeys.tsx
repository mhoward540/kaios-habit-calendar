import { Component, createSignal, Match, Switch } from "solid-js";
import SleepyBoyMenu, {
  ActionMenuItem,
  GroupedItems,
  Menu,
} from "@/SleepyBoyMenu";
import { createShortcut } from "@solid-primitives/keyboard";
import { useCalendarData } from "./CalendarDataProvider";

const Softkeys: Component = () => {
  const [isHabitMenuOpen, setIsHabitMenuOpen] = createSignal(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = createSignal(false);

  const {
    habits: {
      selectedHabit,
      setSelectedHabit,
      habitList,
      setShouldShowAddHabitPopup,
      setHabitData,
    },
    calendar: { increment, decrement },
  } = useCalendarData();

  const habitMenu = (): Menu => {
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

  const optionsMenu = (): Menu => {
    return {
      items: [
        {
          name: "Delete all habits",
          value: "lmao-l8r",
          handler: () => setHabitData({}),
        },
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
      setIsHabitMenuOpen(true);
    },
    { requireReset: true }
  );

  createShortcut(
    ["SOFTLEFT"],
    () => {
      setIsOptionsMenuOpen(true);
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
      <Switch>
        <Match when={isHabitMenuOpen()}>
          <SleepyBoyMenu
            selected={selectedHabit()}
            menu={habitMenu()}
            handleClose={() => setIsHabitMenuOpen(false)}
          />
        </Match>
        <Match when={isOptionsMenuOpen()}>
          <SleepyBoyMenu
            selected={""}
            menu={optionsMenu()}
            handleClose={() => setIsOptionsMenuOpen(false)}
          />
        </Match>
      </Switch>
    </>
  );
};

export default Softkeys;
