import { Component, createSignal, For, Index, Show } from "solid-js";
import { useCalendarData } from "./CalendarDataProvider";
import cx from "classnames";
import { createShortcut } from "@solid-primitives/keyboard";
import SleepyBoyMenu, { Menu } from "@/SleepyBoyMenu";

// TODO localization should be easyish with toLocaleString. We just need to get the user's locale
const monthOptions = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CalendarHeader: Component = () => {
  const {
    calendar: {
      displayMonth,
      thisMonth,
      increment,
      decrement,
      resetDisplay,
      setMonth,
      setYear,
    },
    habits: { habitList, setSelectedHabit },
  } = useCalendarData();
  const handleResetDisplay = (e: Event) => {
    e.preventDefault();
    resetDisplay();
  };

  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

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

  // TODO this is a little hacky but is fine for now. We don't check boundaries to go to next or prev month
  //  we also don't check which years already have data. So it's possible the months that the years which have data
  //  are not reflected here (if they are more than 5 years ago). It's a bit of an edge case now so it's not a big deal
  const yearOptions = () =>
    [
      // 5 years ago + this year + 5 years into the future
      ...Array(11).keys(),
    ].map((i) => thisMonth.getFullYear() + (i - 5));

  const myMenu: Menu = {
    items: [
      {
        name: "Select Habit",
        submenu: {
          handleBasicItem: (item) => {
            setSelectedHabit(item.name);
          },
          items: habitList().map((name) => ({ name })),
        },
      },
      {
        name: "Toggle Dark Mode",
        handler: () => {
          console.log("Toggled dark mode");
        },
      },
    ],
  };

  return (
    <div
      class={cx(
        "w-full",
        "h-full",
        "grid",
        "grid-cols-5",
        "text-center",
        "text-xl"
      )}
    >
      <div onClick={(_) => decrement()}>{"<"}</div>
      <div class="col-span-3">
        <select
          value={displayMonth().getMonth()}
          onChange={(e) => setMonth(parseInt(e.currentTarget.value as string))}
        >
          <Index each={monthOptions}>
            {(monthOption, i) => (
              <option value={i.toString()}>{monthOption}</option>
            )}
          </Index>
        </select>
        <select
          value={displayMonth().getFullYear()}
          onChange={(e) => setYear(parseInt(e.currentTarget.value as string))}
        >
          {/* */}
          <optgroup>
            <Index each={yearOptions()}>
              {(yearOption, i) => (
                <option value={yearOption()}>{yearOption()}</option>
              )}
            </Index>
          </optgroup>
        </select>
        &nbsp
        <button
          onClick={(e) => handleResetDisplay(e)}
          title="Go to current month"
        >
          📅
        </button>
      </div>
      <div onClick={(_) => increment()}>{">"}</div>
      <Show when={isMenuOpen()}>
        <SleepyBoyMenu menu={myMenu} handleClose={() => setIsMenuOpen(false)} />
      </Show>
    </div>
  );
};

export default CalendarHeader;
