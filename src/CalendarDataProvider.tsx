import {createContext, createSignal, useContext} from "solid-js";
import {cloneDate} from "./utils/CalendarUtils";
import useLocalStorage from "./hooks/useLocalStorage";
import {CalendarEntryStatus, CalendarYear, HabitData} from "./types";

interface Props {
  initialDate: Date
  children?: any
}

const todaysDate = new Date()
const thisMonth = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1)

export const makeCalendarDataContext = (initialDate = todaysDate) => {
  const [displayMonth, setDisplayMonth] = createSignal(initialDate);
  const [habitData, setHabitData] = useLocalStorage<HabitData>("habits", {
    "Washing my willy": {
      "2022": {
        "6-22": {date: "2022-6-22", status: CalendarEntryStatus.DONE},
        "6-23": {date: "2022-6-23", status: CalendarEntryStatus.PARTIAL},
        "6-24": {date: "2022-6-24", status: CalendarEntryStatus.FAILED},
        "6-25": {date: "2022-6-25", status: CalendarEntryStatus.EMPTY},
      }
    },
    "Something funny": {}
  })
  // TODO make nullable and handle - needed to accommodate adding the first habit
  // TODO base this off of habitData somehow - probably need a useEffect type thing here
  const [selectedHabit, setSelectedHabit] = createSignal<string>("Washing my willy")
  const yearData = () => habitData()[selectedHabit()];
  const setYearData = (yearData: CalendarYear) => setHabitData({
    ...habitData(),
    [selectedHabit()]: yearData
  })

  const habitList = () => Object.keys(habitData())

  return {
    "calendar": {
      thisMonth,
      todaysDate,
      displayMonth,
      // TODO simplify this shit, I have too many functions doing similar things
      increment: () => {
        const newMonth = cloneDate(displayMonth())
        newMonth.setMonth(newMonth.getMonth() + 1)
        setDisplayMonth(newMonth)
      },
      decrement: () => {
        const newMonth = cloneDate(displayMonth())
        newMonth.setMonth(newMonth.getMonth() - 1)
        setDisplayMonth(newMonth)
      },
      resetDisplay: () => {
        setDisplayMonth(thisMonth)
      },
      setMonth: (monthIndex: number) => {
        const newMonth = cloneDate(displayMonth())
        newMonth.setMonth(monthIndex)
        setDisplayMonth(newMonth)
      },
      setYear: (year: number) => {
        const newMonth = cloneDate(displayMonth())
        newMonth.setFullYear(year)
        setDisplayMonth(newMonth)
      }
    },
    "habits": {
      selectedHabit,
      setSelectedHabit,
      habitData,
      setHabitData,
      yearData,
      setYearData,
      habitList
    }
  }
}

type CalendarDataContextType = ReturnType<typeof makeCalendarDataContext>;
export const CalendarDataContext = createContext<CalendarDataContextType>();

export const useCalendarData = () => useContext(CalendarDataContext)!;

export function CalendarDataProvider(props: Props) {
  const data = makeCalendarDataContext(props.initialDate)
  return (
    <CalendarDataContext.Provider value={data}>
      {props.children}
    </CalendarDataContext.Provider>
  );
}