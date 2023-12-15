import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import "dayjs/locale/en";
import advancedFormat from "dayjs/plugin/advancedFormat";
import buddhistEra from "dayjs/plugin/buddhistEra";

// Plugins
dayjs.extend(advancedFormat);
dayjs.extend(buddhistEra);

type Locale = "th" | "en";

type TDate = Date | string | number | Dayjs;

const inputToDayjs = (input: TDate): Dayjs => dayjs(input);

export const getDateFormat = (date: TDate, locale: Locale = "th") =>
  locale === "th"
    ? inputToDayjs(date).locale("th").format("DD MMMM BBBB")
    : inputToDayjs(date).locale("en").format("DD MMMM YYYY");

export const getTimeFormat = (date: TDate, locale: Locale = "th") =>
  locale === "th"
    ? inputToDayjs(date).locale("th").format("HH:mm:ss")
    : inputToDayjs(date).locale("en").format("HH:mm:ss");

export const getDateTimeFormat = (date: TDate, locale: Locale = "th") =>
  locale === "th"
    ? inputToDayjs(date).locale("th").format("DD MMMM BBBB HH:mm:ss")
    : inputToDayjs(date).locale("en").format("DD MMMM YYYY HH:mm:ss");
