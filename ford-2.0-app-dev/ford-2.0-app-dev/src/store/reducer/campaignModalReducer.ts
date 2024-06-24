import { Campaign } from "../../model/Campaign";

interface CampaignModalState {
  isCampaignModalVisible: boolean;
  campaign?: Campaign;
}

const defaultState: CampaignModalState = {
  isCampaignModalVisible: false,
  campaign: undefined
};

export type CampaignModalAction =
  | { type: "show-campaign-modal", payload: { campaign?: Campaign } }
  | { type: "hide-campaign-modal" };

export function campaignModalReducer(state: CampaignModalState | undefined = defaultState, action: CampaignModalAction): CampaignModalState {
  switch (action.type) {
    case "show-campaign-modal":
      return {
        ...state,
        isCampaignModalVisible: true,
        campaign: action.payload.campaign
      };
    case "hide-campaign-modal":
      return {
        ...state,
        isCampaignModalVisible: false,
        campaign: undefined
      };
    default:
      return state;
  }
}