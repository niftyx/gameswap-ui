import axios from "axios";

type GraphVariables = { [key: string]: string | number };

export const fetchQuery = (
  query: string,
  variables: GraphVariables,
  endpoint: string,
  headers?: any
) => {
  return axios.post(endpoint, { query, variables }, { headers });
};
