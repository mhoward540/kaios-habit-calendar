import type { Component } from "solid-js";
import { createEffect } from "solid-js";
import { useCalendarData } from "./CalendarDataProvider";

const DEFAULT_MESSAGE =
  "Type the name of your habit here! Come back every day to track it";

const AddHabitPopup: Component = () => {
  const {
    habits: {
      shouldShowAddHabitPopup,
      setShouldShowAddHabitPopup,
      addHabit,
      habitList,
      setSelectedHabit,
    },
  } = useCalendarData();

  createEffect(() => {
    if (!shouldShowAddHabitPopup()) {
      return;
    }

    let message = DEFAULT_MESSAGE;
    for (let i = 0; i < 3; i++) {
      const newHabit = prompt(message);
      const isInvalid = !newHabit || habitList().includes(newHabit);
      if (isInvalid) {
        message = `You've entered an ${
          !newHabit ? "empty" : "existing"
        } habit name, please try again`;
        continue;
      }

      addHabit(newHabit);
      setSelectedHabit(newHabit); // not sure why it's needed but it is
      setShouldShowAddHabitPopup(false);
      return;
    }

    if (habitList().length === 0) {
      window.close();
    } else {
      setSelectedHabit(habitList()[0]);
      setShouldShowAddHabitPopup(false);
    }
  });

  return <></>;
};

export default AddHabitPopup;
