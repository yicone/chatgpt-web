export function getPreviousWeekday(dayOfWeek: number): Date {
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  const daysToSubtract = (7 + currentDayOfWeek - dayOfWeek) % 7;

  currentDate.setDate(currentDate.getDate() - daysToSubtract);
  return currentDate;
}

export function getPreviousMonthday(dayOfMonth: number): Date {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  let targetMonth = currentMonth - 1;
  let targetYear = currentYear;

  if (targetMonth < 0) {
    targetMonth = 11; // 11 表示 12 月
    targetYear--;
  }

  const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const targetDayOfMonth = Math.min(dayOfMonth, lastDayOfTargetMonth);

  return new Date(targetYear, targetMonth, targetDayOfMonth);
}