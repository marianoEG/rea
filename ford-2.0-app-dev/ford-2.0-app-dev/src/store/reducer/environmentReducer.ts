export interface Environment {
  apiHost: string;
  syncFormsOAuthHost: string;
  syncFormsOAuthClient: string;
  syncFormsOAuthSecret: string;
  syncFormsOAuthURI: string;
  syncFormsHost: string;
  saleForce: {
    oAuth: {
      url: string,
      grantType: string,
      clientId: string,
      clientSecret: string,
      accountId: string
    },
    newsletterUrl: string,
    testDriveUrl: string,
  }
}

export const EnvironmentDev: Environment = {
  apiHost: "https://fordeventos.com.ar/dev/api",
  syncFormsOAuthHost: "https://corpqa.sts.ford.com/adfs/oauth2/token",
  syncFormsOAuthClient: "4007b3d5-12ef-528a-b872-da76e67ddf8b",
  syncFormsOAuthSecret: "oNRZU1oTA7J_jAeq17DtGpECi7i3frjoSPasXhik",
  syncFormsOAuthURI: "urn:arck:resource:api:qa",
  syncFormsHost: "https://wwwqa.crmckapi.ford.com/api/v2/dynamicForms/eventos",
  saleForce: {
    oAuth: {
      url: 'https://mcqnv17f7b842zl9ff5g56ky0fh8.auth.marketingcloudapis.com/v2/token',
      grantType: "client_credentials",
      clientId: "ulz3dfknw3qm4txub9shemes",
      clientSecret: "73k1I13itEtsC1fR7o2CGQgP",
      accountId: "546001173"
    },
    newsletterUrl: 'https://mcqnv17f7b842zl9ff5g56ky0fh8.rest.marketingcloudapis.com/hub/v1/dataevents/key:01EFAFD9-E090-4BF1-AF38-837CD52CB629/rowset',
    testDriveUrl: 'https://mcqnv17f7b842zl9ff5g56ky0fh8.rest.marketingcloudapis.com/hub/v1/dataevents/key:E951D90C-9513-4665-B29C-7CD2CF50D66E/rowset'
  }
};

export const EnvironmentProd: Environment = {
  apiHost: "https://fordeventos.com.ar/api",
  syncFormsOAuthHost: "https://corp.sts.ford.com/adfs/oauth2/token",
  syncFormsOAuthClient: "d7ad9082-565a-353f-4a82-b8944f94dc85",
  syncFormsOAuthSecret: "7IhSTdqvWsEDBL621SZN9z5_6QWgDNZ_EDFO2OJS",
  syncFormsOAuthURI: "urn:arck:resource:api:prod",
  syncFormsHost: "https://crmckapi.ford.com/api/v2/dynamicForms/eventos",
  saleForce: {
    oAuth: {
      url: 'https://mcqnv17f7b842zl9ff5g56ky0fh8.auth.marketingcloudapis.com/v2/token',
      grantType: "client_credentials",
      clientId: "ulz3dfknw3qm4txub9shemes",
      clientSecret: "73k1I13itEtsC1fR7o2CGQgP",
      accountId: "546001173"
    },
    newsletterUrl: 'https://mcqnv17f7b842zl9ff5g56ky0fh8.rest.marketingcloudapis.com/hub/v1/dataevents/key:01EFAFD9-E090-4BF1-AF38-837CD52CB629/rowset',
    testDriveUrl: 'https://mcqnv17f7b842zl9ff5g56ky0fh8.rest.marketingcloudapis.com/hub/v1/dataevents/key:E951D90C-9513-4665-B29C-7CD2CF50D66E/rowset'
  }
};

const defaultEnvironment: Environment = EnvironmentDev;

export type EnvironmentAction = { type: "set-environment", payload: Environment };

export function environmentReducer(
  state: Environment | undefined = defaultEnvironment,
  action: EnvironmentAction
): Environment {
  switch (action.type) {
    case "set-environment":
      return {
        ...state,
        apiHost: action.payload.apiHost,
        syncFormsOAuthHost: action.payload.syncFormsOAuthHost,
        syncFormsOAuthClient: action.payload.syncFormsOAuthClient,
        syncFormsOAuthSecret: action.payload.syncFormsOAuthSecret,
        syncFormsOAuthURI: action.payload.syncFormsOAuthURI,
        syncFormsHost: action.payload.syncFormsHost
      };
    default:
      return state;
  }
}
