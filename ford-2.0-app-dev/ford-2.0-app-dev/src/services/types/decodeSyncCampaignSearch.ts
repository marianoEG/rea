import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";

const CampaignSearchResponseCodec = t.void;

export const decodeSyncCampaignSearch = (json: unknown) => {
  return either.map(CampaignSearchResponseCodec.decode(json), () => { });
};