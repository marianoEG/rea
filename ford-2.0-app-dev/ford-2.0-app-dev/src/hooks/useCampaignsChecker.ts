import { useState, useEffect } from "react";
import { DefaultRootState, useSelector } from "react-redux";
import { useDbContext } from "../context/DbContext";
import { Campaign } from "../model/Campaign";
import { CampaignSearch } from "../model/CampaignSearch";
import { getCampaign, saveCampaignSearch } from "../utils/db";
import { isNumeric, isValidPatent } from "../utils/utils";

export const useCampaignsChecker = () => {
    const [searchCampaignAtLeastOnce, setSearchCampaignAtLeastOnce] = useState<boolean>(false);
    const [isSearchingCampaign, setIsSearchingCampaign] = useState<boolean>(false);
    const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);
    const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const { db } = useDbContext();

    const searchCampaign = async (text?: string) => {
        if (text == undefined || text == '') {
            setSnackBarMessage('Por favor, ingrese una patente o VIN');
            return;
        }

        let patent: string | undefined = undefined;
        let vin: string | undefined = undefined;
        if (isNumeric(text)) {
            vin = text;
        } else if (isValidPatent(text)) {
            patent = text;
        } else {
            setSnackBarMessage('Por favor, ingrese un valor válido');
            return;
        }

        setIsSearchingCampaign(true);
        const currentDate = new Date();
        try {
            const campaigns = await getCampaign(db!, patent, vin);
            if (campaigns && campaigns.length > 0) {
                const campaign = campaigns.shift();
                await saveCampaignSearch(db!, getCampaignSearch(text, currentDate, campaign));
                setCampaign(campaign);
            }
            else {
                await saveCampaignSearch(db!, getCampaignSearch(text, currentDate, undefined));
                setCampaign(undefined);
            }

        } catch (error) {
            console.log("Error to search campaign:", error);
            setSnackBarMessage('Ocurrió un error al obtener la campaña, revisa el valor ingresado');
            setCampaign(undefined);
        }
        console.log("Duración de búsqueda total", (new Date().getTime() - currentDate.getTime()) / 1000);
        setSearchCampaignAtLeastOnce(true);
        setIsSearchingCampaign(false);
    }

    const dismissSnackBarMessage = () => {
        setSnackBarMessage(null);
    }

    const getCampaignSearch = (searchText?: string, searchDate?: Date, campaign?: Campaign): CampaignSearch => {
        return {
            eventId: currentEvent?.id,
            eventName: currentEvent?.name,
            searchText: searchText,
            searchDate: searchDate,
            campaign: {
                id: campaign?.id,
                env: campaign?.env,
                vin: campaign?.vin,
                cc: campaign?.cc,
                pat: campaign?.pat,
                serv: campaign?.serv,
                fecha_serv: campaign?.fecha_serv,
                manten: campaign?.manten
            }
        }
    }

    return {
        isSearchingCampaign,
        searchCampaignAtLeastOnce,
        campaign,
        searchCampaign,
        snackBarMessage,
        dismissSnackBarMessage
    };
};