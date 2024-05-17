export interface Week {
  year: number
  month: number
  weekNumberInMonth: number
  weekNumber: number
}

export function getWeeksArray(startTime: Date, endTime: Date): Week[] {
  let weeks: Week[] = []

  let initYear = startTime.getFullYear()
  let initWeekNumber = getWeekYear(startTime)

  const endYear = endTime.getFullYear()
  const endWeekNumber = getWeekYear(endTime)

  while (initYear < endYear) {
    const weeksInYear = getWeekYear(new Date(initYear, 11, 31))
    while (initWeekNumber <= weeksInYear) {
      weeks.push({
        year: initYear,
        month: getMonthByWeekNumber(initWeekNumber) + 1,
        weekNumberInMonth: getWeekMonth(initYear, initWeekNumber),
        weekNumber: initWeekNumber,
      })
      initWeekNumber++
    }
    initYear++
    initWeekNumber = 1
  }

  while (initWeekNumber <= endWeekNumber) {
    weeks.push({
      year: initYear,
      month: getMonthByWeekNumber(initWeekNumber) + 1,
      weekNumberInMonth: getWeekMonth(initYear, initWeekNumber),
      weekNumber: initWeekNumber,
    })
    initWeekNumber++
  }

  return weeks
}

function getWeekYear(d: Date) {
  var date = new Date(d.getTime())
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  var week1 = new Date(date.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  )
}

function getMonthByWeekNumber(weekNumber: number): number {
  return new Date(1000 * 60 * 60 * 24 * 7 * weekNumber).getMonth()
}

function getWeekMonth(year: number, weekNumber: number): number {
  const month = getMonthByWeekNumber(weekNumber)

  const date = new Date(year, month, 1)

  const firstWeekInMonth = getWeekYear(date)

  return weekNumber - firstWeekInMonth + 1
}
