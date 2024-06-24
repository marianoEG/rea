import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { TNullableString } from "../../utils/constants";
import { Configuration } from "../../model/Configuration";
import { getSafeOrUndefined } from "../../utils/utils";

const ConfigurationResponseCodec = t.union([
  t.null,
  t.undefined,
  t.type({
    testDriveDemarcationOwnerUrl: TNullableString,
    testDriveDemarcationFordUrl: TNullableString,
    testDriveDemarcationOwnerInCaravanUrl: TNullableString,
    testDriveTermsUrl: TNullableString,
    newsletterUrl: TNullableString,
    quoteUrl: TNullableString,
    contactData: TNullableString
  })
]);

const toConfiguration = (parsed: t.TypeOf<typeof ConfigurationResponseCodec>): Configuration => {
  return {
    testDriveDemarcationOwnerUrl: getSafeOrUndefined(parsed?.testDriveDemarcationOwnerUrl),
    testDriveDemarcationFordUrl: getSafeOrUndefined(parsed?.testDriveDemarcationFordUrl),
    testDriveDemarcationOwnerInCaravanUrl: getSafeOrUndefined(parsed?.testDriveDemarcationOwnerInCaravanUrl),
    testDriveTermsUrl: getSafeOrUndefined(parsed?.testDriveTermsUrl),
    newsletterUrl: getSafeOrUndefined(parsed?.newsletterUrl),
    quoteUrl: getSafeOrUndefined(parsed?.quoteUrl),
    contactData: getSafeOrUndefined(parsed?.contactData)
  };
};

export const decodeConfigurationResponse = (json: unknown) => {
  return either.map(ConfigurationResponseCodec.decode(json), toConfiguration);
};