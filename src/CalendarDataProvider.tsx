import { createContext, createSignal, useContext } from "solid-js";
import { cloneDate } from "./utils/CalendarUtils";
import useLocalStorage from "./hooks/useLocalStorage";
import { CalendarYear, HabitData } from "./types";

interface Props {
  initialDate: Date;
  children?: any;
}

const todaysDate = new Date();
const thisMonth = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1);

export const makeCalendarDataContext = (initialDate = todaysDate) => {
  const [displayMonth, setDisplayMonth] = createSignal(initialDate);
  const [habitData, setHabitData] = useLocalStorage<HabitData>("habits", {});
  const habitList = () => Object.keys(habitData());

  // TODO make nullable and handle - needed to accommodate adding the first habit
  const [selectedHabit, setSelectedHabit] = createSignal<string>(
    habitList().length === 0 ? "" : habitList()[0]
  );
  const yearData = () => habitData()[selectedHabit()];
  const setYearData = (yearData: CalendarYear) =>
    setHabitData({
      ...habitData(),
      [selectedHabit()]: yearData,
    });

  const [showAddHabitPopup, setShouldShowAddHabitPopup] = createSignal(false);
  const shouldShowAddHabitPopup = () =>
    habitList().length === 0 || showAddHabitPopup();

  const addHabit = (habitName: string) => {
    setHabitData({
      ...habitData(),
      [habitName]: {},
    });

    if (habitList().length === 1) {
      setSelectedHabit(habitName);
    }
  };

  const deleteHabit = (habitName: string) => {
    const { [habitName]: thing, ...rest } = habitData();
    setHabitData(rest);
    if (selectedHabit() === habitName && habitList().length > 0) {
      setSelectedHabit(habitList()[0]);
    }
  };

  return {
    calendar: {
      thisMonth,
      todaysDate,
      displayMonth,
      increment: () => {
        const newMonth = cloneDate(displayMonth());
        newMonth.setMonth(newMonth.getMonth() + 1);
        setDisplayMonth(newMonth);
      },
      decrement: () => {
        const newMonth = cloneDate(displayMonth());
        newMonth.setMonth(newMonth.getMonth() - 1);
        setDisplayMonth(newMonth);
      },
      resetDisplay: () => {
        setDisplayMonth(thisMonth);
      },
      setMonth: (monthIndex: number) => {
        const newMonth = cloneDate(displayMonth());
        newMonth.setMonth(monthIndex);
        setDisplayMonth(newMonth);
      },
      setYear: (year: number) => {
        const newMonth = cloneDate(displayMonth());
        newMonth.setFullYear(year);
        setDisplayMonth(newMonth);
      },
    },
    habits: {
      addHabit,
      deleteHabit,
      showAddHabitPopup,
      setShouldShowAddHabitPopup,
      shouldShowAddHabitPopup,
      selectedHabit,
      setSelectedHabit,
      habitData,
      setHabitData,
      yearData,
      setYearData,
      habitList,
    },
  };
};

type CalendarDataContextType = ReturnType<typeof makeCalendarDataContext>;
export const CalendarDataContext = createContext<CalendarDataContextType>();

export const useCalendarData = () => useContext(CalendarDataContext)!;

export function CalendarDataProvider(props: Props) {
  const data = makeCalendarDataContext(props.initialDate);
  return (
    <CalendarDataContext.Provider value={data}>
      {props.children}
    </CalendarDataContext.Provider>
  );
}
