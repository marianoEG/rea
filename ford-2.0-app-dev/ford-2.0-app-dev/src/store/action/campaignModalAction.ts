import { CampaignModalAction } from "../reducer/campaignModalReducer";
import { Campaign } from '../../model/Campaign';

export const showCampaignModal = (campaign?: Campaign): CampaignModalAction => ({
  type: "show-campaign-modal",
  payload: { campaign }
});

export const hideCampaignModal = (): CampaignModalAction => ({
  type: "hide-campaign-modal"
});
