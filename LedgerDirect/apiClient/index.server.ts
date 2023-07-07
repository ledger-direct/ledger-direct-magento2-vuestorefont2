/*
import axios from 'axios';

function onCreate(settings) {
  if (!settings?.client) {
    return init(settings);
  }

  return {
    config: settings,
    client: settings.client
  };
}


const { createApiClient } = apiClientFactory<any, any>({
  onCreate,
  api: {
    getProduct
  }
});

const init = (settings) => {
  const client = axios.create({
    baseURL: settings.api.url
  });

  return {
    config: settings,
    client
  };
};

export {
  createApiClient,
  init // export init function
};
*/
