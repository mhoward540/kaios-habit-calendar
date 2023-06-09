import { Component, onMount } from "solid-js";
import { For, createSignal } from "solid-js";
import { createShortcut } from "@solid-primitives/keyboard";
import cx from "classnames";
import {
  cloneDate,
  dateStringToKey,
  dateToKey,
  dateToString,
  iterateNumDays,
  partsFromDateString,
} from "./utils/CalendarUtils";
import { useCalendarData } from "./CalendarDataProvider";
import {
  CalendarEntry,
  CalendarEntryStatus,
  CalendarMonth,
  DateString,
} from "./types";
import styles from "./HabitCalendar.module.css";

const habitStatusToIndex = [
  CalendarEntryStatus.DONE,
  CalendarEntryStatus.FAILED,
  CalendarEntryStatus.PARTIAL,
  CalendarEntryStatus.EMPTY,
];

const HabitCalendar: Component = () => {
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  const calendarCellRefs: (HTMLDivElement | undefined)[] = Array(42);

  const handleNav = (amount: number) => {
    let newIndex = (selectedIndex() + amount) % 42;
    if (newIndex < 0) {
      newIndex = 42 + newIndex;
    }

    setSelectedIndex(newIndex);
    calendarCellRefs[newIndex]?.focus();
  };

  onMount(() => {
    handleNav(0);
  });

  const keyToIncrement: [string, number][] = [
    ["ArrowLeft", -1],
    ["ArrowRight", 1],
    ["ArrowUp", -7],
    ["ArrowDown", 7],
  ];

  keyToIncrement.map(([key, increment]) => {
    createShortcut([key], () => handleNav(increment), {
      preventDefault: false,
      requireReset: true,
    });
  });

  createShortcut(
    ["Enter"],
    () => {
      calendarCellRefs[selectedIndex()]?.click(); // hacky but I already handled clicking soooo
      // also hack. i want focus to stay after click. preventing default doesnt seem to work
      setTimeout(() => calendarCellRefs[selectedIndex()]?.focus(), 10);
    },
    {
      preventDefault: false,
      requireReset: true,
    }
  );

  const {
    calendar: { todaysDate, dayNames, displayMonth },
    habits: { yearData, setYearData },
  } = useCalendarData();

  const monthData = () =>
    yearData()?.[displayMonth().getFullYear().toString()] || null;

  const displayArr = () => {
    const md = monthData() || {};

    const calendarStart = cloneDate(displayMonth());
    calendarStart.setDate(displayMonth().getDate() - displayMonth().getDay());

    // TODO logic to change the first day in the week goes here (e.g. setting for starting week on Sunday or Monday)
    const monthArr = [...iterateNumDays(calendarStart, 42)];

    // Array which represents the calendar. Calendar is 42 cells. 1st of month starts
    // at its corresponding day index so that each date lines up with the day it falls on
    return monthArr.map(
      (d) =>
        ({
          status: md[dateToKey(d)]?.status || CalendarEntryStatus.EMPTY,
          date: dateToString(d),
        } as CalendarEntry)
    );
  };

  // TODO might be faster to split out the data in local storage and the data in the display arr
  //   we can create a signal for the display arr which defaults based on the data in the local storage
  //   then on every update we just keep them in sync. This way we don't have to re-render the whole array (? need to check that)
  //   since we can just update by arr index
  const handleCellClick = (clickedDate: DateString) => {
    const yearKey = partsFromDateString(clickedDate)["year"].toString();
    const monthKey = dateStringToKey(clickedDate);
    const clickedMonthData = monthData() || {};
    const entryStatus =
      clickedMonthData[monthKey]?.status || CalendarEntryStatus.EMPTY;
    const entryStatusIndex = habitStatusToIndex.indexOf(entryStatus);
    const newEntryStatusIndex =
      (entryStatusIndex + 1) % habitStatusToIndex.length;
    const newEntryStatus = habitStatusToIndex[newEntryStatusIndex];

    let newMonthData: CalendarMonth;
    if (newEntryStatus === CalendarEntryStatus.EMPTY) {
      // remove data at the key "monthKey" and keep the rest of the data
      // this reduces the amount of data being stored in the local storage
      const { [monthKey]: _ = null, ...rest } = clickedMonthData;
      newMonthData = rest;
    } else {
      newMonthData = {
        ...clickedMonthData,
        [monthKey]: {
          status: newEntryStatus,
          date: clickedDate,
        },
      };
    }

    setYearData({
      ...yearData(),
      [yearKey]: newMonthData,
    });
  };

  return (
    <div class="w-full h-full">
      <div
        class="w-full grid gap-1 grid-cols-7 grid-rows-1"
        style={{ height: "5%", "margin-bottom": "2%" }}
      >
        <For each={dayNames}>
          {(dayOfWeek) => (
            <div class="text-center font-bold" style={{ "font-size": "1rem" }}>
              {dayOfWeek}
            </div>
          )}
        </For>
      </div>
      <div
        class="w-full grid gap-1 grid-cols-7 grid-rows-6"
        style={{ height: "93%" }}
      >
        <For each={displayArr()}>
          {(currEntry, i) => {
            const { year, month, date } = partsFromDateString(currEntry.date);

            const currentDayClasses =
              todaysDate.getDate() === date &&
              todaysDate.getMonth() === month &&
              todaysDate.getFullYear() === year
                ? ["underline", "font-bold"]
                : [];

            const key = dateStringToKey(currEntry.date);
            const dayData = monthData()?.[key];
            const dayClasses = dayData
              ? {
                  [styles.completed]:
                    dayData.status === CalendarEntryStatus.DONE,
                  [styles.failed]:
                    dayData.status === CalendarEntryStatus.FAILED,
                  [styles.partial]:
                    dayData.status === CalendarEntryStatus.PARTIAL,
                }
              : {};

            const textColorClass =
              month !== displayMonth().getMonth() ? [styles.prevMonthCell] : [];

            return (
              <div
                class={cx(
                  "text-center",
                  currentDayClasses,
                  dayClasses,
                  textColorClass
                )}
                tabIndex={i()}
                onClick={(_) => handleCellClick(currEntry.date)}
                ref={calendarCellRefs[i()]}
              >
                {date}
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default HabitCalendar;
