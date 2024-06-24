import { IsoDateRegexp, IsoDateRegexpWithMiliseconds, IsoDateRegexpWithMilisecondsAndZ } from "./regular-expressions";

export const ISOToDate = (isoDate?: string | null): Date | undefined => {
    if (!isoDate) return undefined;
    try {
        if (IsoDateRegexpWithMilisecondsAndZ.test(isoDate)) // '2011-10-05T14:48:00.000Z'
            return new Date(isoDate);
        else if (IsoDateRegexpWithMiliseconds.test(isoDate)) // '2011-10-05T14:48:00.000'
            return new Date(isoDate + 'Z');
        else if (IsoDateRegexp.test(isoDate)) // '2011-10-05T14:48:00'
            return new Date(isoDate + '.000Z');
        else return new Date(isoDate);
    } catch (error) {
        console.log("error to parse Date: ", isoDate);
        return undefined;
    }
}