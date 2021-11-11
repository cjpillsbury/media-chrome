const isValidNumber = (x) => typeof x === "number" && !Number.isNaN(x) && Number.isFinite(x);
const UnitLabels = [
  {
    singular: "hour",
    plural: "hours"
  },
  {
    singular: "minute",
    plural: "minutes"
  },
  {
    singular: "second",
    plural: "seconds"
  }
];
const toTimeUnitPhrase = (timeUnitValue, unitIndex) => {
  const unitLabel = timeUnitValue === 1 ? UnitLabels[unitIndex].singular : UnitLabels[unitIndex].plural;
  return `${timeUnitValue} ${unitLabel}`;
};
export const formatAsTimePhrase = (seconds) => {
  if (!isValidNumber(seconds))
    return "";
  const positiveSeconds = Math.abs(seconds);
  const negative = positiveSeconds !== seconds;
  const secondsDateTime = new Date(0, 0, 0, 0, 0, positiveSeconds, 0);
  const timeParts = [secondsDateTime.getHours(), secondsDateTime.getMinutes(), secondsDateTime.getSeconds()];
  const timeString = timeParts.map((timeUnitValue, index) => timeUnitValue && toTimeUnitPhrase(timeUnitValue, index)).filter((x) => x).join(", ");
  const negativeSuffix = negative ? " remaining" : "";
  return `${timeString}${negativeSuffix}`;
};
export function formatTime(seconds, guide) {
  let negative = false;
  if (seconds < 0) {
    negative = true;
    seconds = 0 - seconds;
  }
  seconds = seconds < 0 ? 0 : seconds;
  let s = Math.floor(seconds % 60);
  let m = Math.floor(seconds / 60 % 60);
  let h = Math.floor(seconds / 3600);
  const gm = Math.floor(guide / 60 % 60);
  const gh = Math.floor(guide / 3600);
  if (isNaN(seconds) || seconds === Infinity) {
    h = m = s = "-";
  }
  h = h > 0 || gh > 0 ? h + ":" : "";
  m = ((h || gm >= 10) && m < 10 ? "0" + m : m) + ":";
  s = s < 10 ? "0" + s : s;
  return (negative ? "-" : "") + h + m + s;
}
