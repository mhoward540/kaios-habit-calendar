import { Component, Index } from "solid-js";
import { createShortcut } from "@solid-primitives/keyboard";
import { useCalendarData } from "./CalendarDataProvider";

const CalendarControls: Component = () => {
  const {
    calendar: {
      displayMonth,
      thisMonth,
      monthNames,
      increment,
      decrement,
      resetDisplay,
      setMonth,
      setYear,
    },
  } = useCalendarData();
  const handleResetDisplay = (e: Event) => {
    e.preventDefault();
    resetDisplay();
  };

  let yearSelectRef: HTMLSelectElement | undefined;
  let monthSelectRef: HTMLSelectElement | undefined;
  let currentDayButtonRef: HTMLButtonElement | undefined;

  createShortcut(["4"], () => monthSelectRef && monthSelectRef.focus(), {
    preventDefault: false,
    requireReset: true,
  });

  createShortcut(
    ["2"],
    () => currentDayButtonRef && currentDayButtonRef.click(),
    {
      preventDefault: false,
      requireReset: true,
    }
  );

  createShortcut(["6"], () => yearSelectRef && yearSelectRef.focus(), {
    preventDefault: false,
    requireReset: true,
  });

  // TODO this is a little hacky but is fine for now. We don't check boundaries to go to next or prev month
  //  we also don't check which years already have data. So it's possible the months that the years which have data
  //  are not reflected here (if they are more than 5 years ago). It's a bit of an edge case now so it's not a big deal
  const yearOptions = () =>
    [
      // 5 years ago + this year + 5 years into the future
      ...Array(11).keys(),
    ].map((i) => thisMonth.getFullYear() + (i - 5));

  return (
    <div class="w-full h-full grid grid-cols-5 text-center text-xl">
      <div onClick={(_) => decrement()}>{"<"}</div>
      <div class="col-span-3">
        <select
          ref={monthSelectRef}
          value={displayMonth().getMonth()}
          onChange={(e) => setMonth(parseInt(e.currentTarget.value as string))}
        >
          <Index each={monthNames}>
            {(monthOption, i) => (
              <option value={i.toString()}>{monthOption()}</option>
            )}
          </Index>
        </select>
        <select
          ref={yearSelectRef}
          value={displayMonth().getFullYear()}
          onChange={(e) => setYear(parseInt(e.currentTarget.value as string))}
        >
          <Index each={yearOptions()}>
            {(yearOption, i) => (
              <option value={yearOption()}>{yearOption()}</option>
            )}
          </Index>
        </select>
        &nbsp
        <button
          ref={currentDayButtonRef}
          onClick={(e) => handleResetDisplay(e)}
          title="Go to current month"
        >
          📅
        </button>
      </div>
      <div onClick={(_) => increment()}>{">"}</div>
    </div>
  );
};

export default CalendarControls;
