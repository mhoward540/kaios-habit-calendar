import { Component, createSignal, Match, Switch } from "solid-js";
import SleepyBoyMenu, {
  ActionMenuItem,
  GroupedItems,
  Menu,
} from "@/SleepyBoyMenu";
import { createShortcut } from "@solid-primitives/keyboard";
import { useCalendarData } from "./CalendarDataProvider";

const APP_INFO_TEXT = `This app is meant to help you build habits and keep track of your progress. Add new habits here and try to keep up with them each day!

Controls:
1 - Back 1 month
3 - Forward 1 month
DPAD - Select a day
SELECT - Update habit status

Habit statuses:
GREEN - Done
YELLOW - Partial
RED - Missed

Credits:
Created by Matt Howard
https://www.github.com/mhoward540

Some hooks copied from:
https://github.com/NukeJS/solidjs-hooks

Some CSS/JS for KaiOS styling from:
https://github.com/canicjusz/KaiOS-native-UI

Agenda icons created by Saepul Nahwan - Flaticon
https://www.flaticon.com/free-icons/agenda`;

const Softkeys: Component = () => {
  const [isHabitMenuOpen, setIsHabitMenuOpen] = createSignal(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = createSignal(false);

  const {
    habits: {
      selectedHabit,
      setSelectedHabit,
      habitList,
      setShouldShowAddHabitPopup,
      deleteHabit,
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
    const habits: ActionMenuItem[] = habitList().map((habitName) => ({
      name: habitName,
      value: habitName,
      handler: () => deleteHabit(habitName),
    }));

    const habitGroup: GroupedItems = {
      groupName: "Delete habit",
      items: habits,
    };

    return {
      items: [
        {
          name: "App info",
          value: "app-info",
          handler: () => alert(APP_INFO_TEXT),
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

  createShortcut(["SOFTRIGHT"], () => setIsHabitMenuOpen(true), {
    requireReset: true,
  });

  createShortcut(["SOFTLEFT"], () => setIsOptionsMenuOpen(true), {
    requireReset: true,
  });

  // const [keys, { event }] = useKeyDownList();

  // createEffect(() => {
  //   console.log(keys()); // => string[] — list of currently held keys
  //   console.log(event()); // => KeyboardEvent | null — last keydown event
  // });

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
