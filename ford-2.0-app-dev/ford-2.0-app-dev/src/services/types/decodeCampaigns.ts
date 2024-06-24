import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";

const CampaignResponseCodec = t.union([t.null, t.undefined, t.array(t.string)]);

const toCampaigns = (parsed: t.TypeOf<typeof CampaignResponseCodec>): string[] => {
  return parsed && parsed.length > 0 ? parsed : [];
};

export const decodeCampaignResponse = (json: unknown) => {
  return either.map(CampaignResponseCodec.decode(json), toCampaigns);
};