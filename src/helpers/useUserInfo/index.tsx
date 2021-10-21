import { useQuery } from "@apollo/react-hooks";
import { getLogger } from "utils/logger";
import { queryUserById } from "utils/queries";
import { toCamelCaseObj } from "utils/token";
import { IUserInfo } from "utils/types";

const logger = getLogger("useUserInfo::");

interface GraphResponse {
  users: any[];
}

export const useUserInfo = (id: string) => {
  const { data, error, loading } = useQuery<GraphResponse>(queryUserById, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    skip: false,
    variables: { id: id.toLowerCase() },
  });

  return {
    loading,
    userInfo:
      data && data.users.length > 0
        ? (toCamelCaseObj(data.users[0]) as IUserInfo)
        : ({
            name: "",
            address: id.toLowerCase(),
            id: id.toLowerCase(),
            customUrl: "",
            bio: "",
            twitchUsername: "",
            twitterUsername: "",
            twitterVerified: false,
            facebookUsername: "",
            youtubeUsername: "",
            instagramUsername: "",
            tiktokUsername: "",
            personalSite: "",
            imageUrl: "",
            headerImageUrl: "",
          } as IUserInfo),
  };
};
