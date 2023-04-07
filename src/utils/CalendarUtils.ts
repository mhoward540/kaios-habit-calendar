import {DateString} from "../types";

export const cloneDate = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export function* iterateDate(d: Date): Generator<Date> {
  let dateIter = cloneDate(d)
  while (true) {
    yield dateIter;
    dateIter = cloneDate(dateIter)
    dateIter.setDate(dateIter.getDate() + 1)
  }
}

export function* iterateDateToMonthEnd(d: Date): Generator<Date> {
  const currMonth = d.getMonth();
  for (let currDay of iterateDate(d)) {
    if (currDay.getMonth() !== currMonth) {
      break;
    }

    yield currDay;
  }
}

export function* iterateNumDays(start: Date, numDays: number) {
  if (numDays <= 0) {
    throw new Error("something")
  }

  let i = 0;
  for (let currDay of iterateDate(start)) {
    yield currDay;
    i += 1
    if (i === numDays) {
      break
    }
  }

}

export function* iterateBetween(start: Date, end: Date): Generator<Date> {
  if (start > end) {
    console.log(start)
    console.log(end)
    // TODO
    throw new Error("something")
  }

  for (let currDay of iterateDate(start)) {
    if (
      currDay.getDay() === end.getDay() &&
      currDay.getMonth() === end.getMonth() &&
      currDay.getFullYear() === end.getFullYear()
    ) {
      break;
    }

    yield currDay;
  }
}

export const dateFromString = (s: DateString): Date => {
  const [year, monthIndex, date] = s.split("-");
  return new Date(parseInt(year), parseInt(monthIndex), parseInt(date))
}

export const dateToString = (d: Date): DateString => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

export const partsFromDateString = (s: DateString) => {
  const [year, month, date] = s.split("-");
  return {
    year: parseInt(year),
    month: parseInt(month),
    date: parseInt(date)
  }
}
export const dateStringToKey = (s: DateString) => s.split("-").slice(1).join("-")
export const dateToKey = (d: Date): string => `${d.getMonth()}-${d.getDate()}`