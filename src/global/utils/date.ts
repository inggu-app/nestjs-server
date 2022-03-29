export const addDays = (date: Date, days: number) => {
  const clonedDate = new Date(date)
  clonedDate.setDate(clonedDate.getDate() + days)

  return clonedDate
}
