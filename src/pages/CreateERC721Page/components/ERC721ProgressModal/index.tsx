import { ProgressBasicModal, ProgressButton } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { get0xContractAddresses, getToken } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { BigNumber } from "packages/ethers";
import { parseEther } from "packages/ethers/utils";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ERC721Service } from "services";
import { getAPIService } from "services/api";
import { getIPFSService } from "services/ipfs";
import { waitSeconds } from "utils";
import { getFileType } from "utils/asset";
import { getLogger } from "utils/logger";
import { MAX_NUMBER } from "utils/number";
import { buildSellCollectibleOrder, submitCollectibleOrder } from "utils/order";
import { EthersBigNumberTo0xBigNumber } from "utils/token";
import { NetworkId } from "utils/types";

import { ECreateStep } from "../../index";
import { IERC721FormValues } from "../ERC721CreateForm";

const logger = getLogger("CreateERC721Page::Modal");

interface IProps {
  visible: boolean;
  onClose: () => void;
  formValues: IERC721FormValues;
}

enum ECurrentStep {
  Loading,
  Steps,
}
interface IState {
  isLoading: boolean;
  currentStep: ECurrentStep;
  approvedAll: boolean;
  initialApprovedAll: boolean;
  filesUploadPercent: string;
  followStep: ECreateStep;
  error: string;
  filesUploaded: boolean;
  tokenMint: boolean;
  tokenURI: string;
  tokenId: BigNumber;
  contentId: string;
  assetId: string;
}

export const ERC721ProgressModal = (props: IProps) => {
  const context = useConnectedWeb3Context();
  const { account, library: provider, networkId } = context;
  const erc721ProxyAddress = get0xContractAddresses(
    networkId || DEFAULT_NETWORK_ID
  ).erc721proxy;
  const ipfsService = getIPFSService();
  const { formValues, onClose, visible } = props;
  const history = useHistory();
  const wavxToken = getToken(networkId || DEFAULT_NETWORK_ID, "wavax");
  const erc721 = new ERC721Service(
    provider,
    account || "",
    formValues.collectionId
  );
  const [state, setState] = useState<IState>({
    isLoading: false,
    currentStep: ECurrentStep.Loading,
    followStep: ECreateStep.ApproveAll,
    error: "",
    approvedAll: false,
    initialApprovedAll: false,
    filesUploaded: false,
    tokenMint: false,
    tokenURI: "",
    tokenId: BigNumber.from(0),
    filesUploadPercent: "0",
    contentId: "",
    assetId: "",
  });
  const apiService = getAPIService();

  const loadInitialData = async () => {
    try {
      let isApprovedAll: boolean;

      if (formValues.putOnSale) {
        isApprovedAll = await erc721.isApprovedForAll(
          account || "",
          erc721ProxyAddress
        );

        logger.log("isApprovedAll", isApprovedAll);
      }

      setState((prevState) => ({
        ...prevState,
        approvedAll: isApprovedAll,
        initialApprovedAll: isApprovedAll,
        currentStep: ECurrentStep.Steps,
        followStep:
          isApprovedAll || !formValues.putOnSale
            ? ECreateStep.UploadFiles
            : ECreateStep.ApproveAll,
      }));
    } catch (error) {
      logger.error(error);
    }
  };

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.currentStep === ECurrentStep.Steps) {
      if (state.followStep === ECreateStep.ApproveAll) {
        approveAll();
      } else if (state.followStep === ECreateStep.UploadFiles) {
        uploadFiles();
      } else if (state.followStep === ECreateStep.MintToken) {
        mintToken();
      } else if (state.followStep === ECreateStep.SignSellOrder) {
        signSellOrder();
      }
    }
    // eslint-disable-next-line
  }, [state.currentStep, state.followStep]);

  const approveAll = async () => {
    try {
      setState((prevState) => ({ ...prevState, error: "", isLoading: true }));
      await erc721.approveForAll(erc721ProxyAddress, true);
      setState((prevState) => ({
        ...prevState,
        error: "",
        approvedAll: true,
        followStep: ECreateStep.UploadFiles,
        isLoading: false,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        isLoading: false,
      }));
      logger.error(error);
    }
  };

  const uploadFiles = async () => {
    try {
      if (!formValues.image) return;
      setState((prevState) => ({
        ...prevState,
        error: "",
        isLoading: true,
      }));

      let encryptedContent: { lockedData: string; contentId: string } = {
        lockedData: "",
        contentId: "",
      };

      if (formValues.lockedContent) {
        encryptedContent = await apiService.getEncryptedContentData(
          formValues.lockedContent
        );
        setState((prev) => ({
          ...prev,
          contentId: encryptedContent.contentId,
        }));
      }

      const totalFileSize =
        formValues.image.size +
        (formValues.rar ? formValues.rar.size : 0) +
        (formValues.model ? formValues.model.size : 0);

      let uploadedSize = 0;

      const imageURL = await ipfsService.uploadData(
        formValues.image,
        (progress) => {
          const currentPercent = (progress * 100) / totalFileSize;
          setState((prevState) => ({
            ...prevState,
            filesUploadPercent:
              currentPercent < 99 ? currentPercent.toFixed(0) : "99",
          }));
        }
      );

      uploadedSize = uploadedSize + formValues.image.size;

      let rarURL = "";
      if (formValues.rar) {
        rarURL = await ipfsService.uploadData(formValues.rar, (progress) => {
          const currentPercent =
            ((uploadedSize + progress) * 100) / totalFileSize;
          setState((prevState) => ({
            ...prevState,
            filesUploadPercent:
              currentPercent < 99 ? currentPercent.toFixed(0) : "99",
          }));
        });

        uploadedSize = uploadedSize + formValues.rar.size;
      }

      let modelURL = "";
      if (formValues.model) {
        modelURL = await ipfsService.uploadData(
          formValues.model,
          (progress) => {
            const currentPercent =
              ((uploadedSize + progress) * 100) / totalFileSize;
            setState((prevState) => ({
              ...prevState,
              filesUploadPercent:
                currentPercent < 99 ? currentPercent.toFixed(0) : "99",
            }));
          }
        );
      }

      const payload = {
        image: imageURL,
        imageType: getFileType(formValues.image),
        rar: rarURL,
        name: formValues.name,
        description: formValues.description,
        royalties: formValues.royalties,
        attributes: formValues.attributes.slice(
          0,
          formValues.attributes.length - 1
        ),
        lockedData: formValues.lockedContent ? encryptedContent.lockedData : "",
        contentId: state.contentId,
        model: modelURL,
      };
      const tokenURI = await ipfsService.uploadData(JSON.stringify(payload));
      setState((prevState) => ({
        ...prevState,
      }));
      setState((prevState) => ({
        ...prevState,
        error: "",
        tokenURI,
        followStep: ECreateStep.MintToken,
        isLoading: false,
        filesUploaded: true,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error:
          error.message ||
          "Sorry we couldn't process the request. Try again later.",
        isLoading: false,
      }));
      logger.warn(error);
    }
  };

  const mintToken = async () => {
    try {
      logger.log("mintToken");
      setState((prevState) => ({ ...prevState, error: "", isLoading: true }));

      const txReceipt = await erc721.mintItem(account || "", state.tokenURI);

      const tokenId = erc721.getCreatedAssetId(txReceipt);

      if (formValues.putOnSale) {
        setState((prevState) => ({
          ...prevState,
          error: "",
          tokenId,
          followStep: ECreateStep.SignSellOrder,
          isLoading: false,
          tokenMint: true,
          assetId: txReceipt.transactionHash.toLowerCase(),
        }));
      } else {
        await waitSeconds(5);
        history.push(`/assets/${txReceipt.transactionHash.toLowerCase()}`);
        onClose();
      }
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        isLoading: false,
      }));
      logger.error(error);
    }
  };

  const signSellOrder = async () => {
    logger.log("signSellOrder");
    try {
      if (!networkId || !context.library) return;
      setState((prevState) => ({
        ...prevState,
        error: "",
        isLoading: true,
      }));
      const signedOrder = await buildSellCollectibleOrder(
        {
          erc721: erc721.address,
          tokenId: EthersBigNumberTo0xBigNumber(state.tokenId),
          account: context.account || "",
          amount: EthersBigNumberTo0xBigNumber(BigNumber.from(1)),
          exchangeAddress: get0xContractAddresses(networkId).exchange,
          erc20Address: formValues.instantSale
            ? formValues.saleToken
            : wavxToken.address,
          price: EthersBigNumberTo0xBigNumber(
            formValues.instantSale
              ? parseEther(formValues.salePrice.toString())
              : MAX_NUMBER
          ),
        },
        networkId as NetworkId,
        context.library.provider
      );
      await submitCollectibleOrder(signedOrder, networkId as NetworkId);

      logger.log("submitResult::Success");

      await waitSeconds(5);
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      history.push(`/assets/${state.assetId}`);
      onClose();
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        isLoading: false,
      }));
      logger.error("signSellOrder::", error);
    }
  };

  return (
    <ProgressBasicModal
      isStepLoading={state.currentStep === ECurrentStep.Loading}
      onClose={onClose}
      visible={visible}
    >
      {!state.initialApprovedAll &&
        formValues.instantSale &&
        formValues.putOnSale && (
          <ProgressButton
            approved={state.approvedAll}
            buttonDisabled={state.followStep !== ECreateStep.ApproveAll}
            buttonLoadingText="Follow wallet instructions"
            buttonTitle="Approve"
            description="Approve perfoming transactions with your wallet"
            errorText={
              state.followStep === ECreateStep.ApproveAll ? state.error : ""
            }
            isLoading={
              state.followStep === ECreateStep.ApproveAll
                ? state.isLoading
                : false
            }
            onClick={approveAll}
            title="Approve"
          />
        )}
      <ProgressButton
        approved={state.filesUploaded}
        buttonDisabled={state.followStep !== ECreateStep.UploadFiles}
        buttonLoadingText="Follow wallet instructions"
        buttonTitle="Upload Files"
        description="Prepare files for minting"
        errorText={
          state.followStep === ECreateStep.UploadFiles ? state.error : ""
        }
        isLoading={
          state.followStep === ECreateStep.UploadFiles ? state.isLoading : false
        }
        onClick={uploadFiles}
        title={`Uploading files ... ${state.filesUploadPercent}%`}
      />
      <ProgressButton
        approved={state.tokenMint}
        buttonDisabled={state.followStep !== ECreateStep.MintToken}
        buttonLoadingText="Follow wallet instructions"
        buttonTitle="Mint token"
        description="Call contract method"
        errorText={
          state.followStep === ECreateStep.MintToken ? state.error : ""
        }
        isLoading={
          state.followStep === ECreateStep.MintToken ? state.isLoading : false
        }
        onClick={mintToken}
        title="Mint token"
      />
      {formValues.putOnSale && (
        <ProgressButton
          approved={false}
          buttonDisabled={state.followStep !== ECreateStep.SignSellOrder}
          buttonLoadingText="Follow wallet instructions"
          buttonTitle="Sign sell order"
          description="Sign sell order using your wallet"
          errorText={
            state.followStep === ECreateStep.SignSellOrder ? state.error : ""
          }
          isLoading={
            state.followStep === ECreateStep.SignSellOrder
              ? state.isLoading
              : false
          }
          onClick={signSellOrder}
          title="Sign sell order"
        />
      )}
    </ProgressBasicModal>
  );
};
