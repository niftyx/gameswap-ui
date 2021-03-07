import { IconButton, Modal, Typography, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import { CommentLoader } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { get0xContractAddresses } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ERC721Service } from "services";
import { getAPIService } from "services/api";
import { getIPFSService } from "services/ipfs";
import useCommonStyles from "styles/common";
import { waitSeconds } from "utils";
import { getFileType } from "utils/asset";
import { getLogger } from "utils/logger";
import { buildSellCollectibleOrder, submitCollectibleOrder } from "utils/order";
import { EthersBigNumberTo0xBigNumber } from "utils/token";
import { NetworkId } from "utils/types";

import { ECreateStep } from "../../index";
import { IERC721FormValues } from "../ERC721CreateForm";
import { ERC721ProgressButton } from "../ERC721ProgressButton";

const logger = getLogger("CreateERC721Page::Modal");

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.colors.border.primary}`,
    boxShadow: theme.shadows[5],
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    maxHeight: "90vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: theme.spacing(3),
    color: theme.colors.text.default,
    flex: 1,
  },
  closeButton: {
    border: `1px solid ${theme.colors.text.default}`,
    color: theme.colors.text.default,
    padding: theme.spacing(0.5),
  },
  content: {
    marginTop: theme.spacing(1),
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  steps: Array<ECreateStep>;
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
  followStep: ECreateStep;
  error: string;
  filesUploadPercent: string;
  filesUploaded: boolean;
  tokenMint: boolean;
  tokenURI: string;
  tokenId: BigNumber;
  contentId: string;
}

export const ERC721ProgressModal = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const context = useConnectedWeb3Context();
  const { account, library: provider, networkId } = context;
  const {
    data: { games },
  } = useGlobal();
  const erc721ProxyAddress = get0xContractAddresses(
    networkId || DEFAULT_NETWORK_ID
  ).erc721proxy;
  const ipfsService = getIPFSService();
  const { formValues, onClose, visible } = props;
  const history = useHistory();
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
  });
  const apiService = getAPIService();

  const loadInitialData = async () => {
    try {
      let isApprovedAll: boolean;

      if (formValues.instantSale) {
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
          isApprovedAll || !formValues.instantSale
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
        filesUploadPercent: "0",
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
        formValues.image.size + (formValues.rar ? formValues.rar.size : 0);

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
      let rarURL = "";
      if (formValues.rar) {
        rarURL = await ipfsService.uploadData(formValues.rar, (progress) => {
          const currentPercent =
            (((formValues.image ? formValues.image.size : 0) + progress) *
              100) /
            totalFileSize;
          setState((prevState) => ({
            ...prevState,
            filesUploadPercent:
              currentPercent < 99 ? currentPercent.toFixed(0) : "99",
          }));
        });
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
      };
      const tokenURI = await ipfsService.uploadData(JSON.stringify(payload));
      setState((prevState) => ({
        ...prevState,
        filesUploadPercent: "100",
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
        error: error.message,
        isLoading: false,
      }));
      logger.error(error);
    }
  };

  const mintToken = async () => {
    try {
      logger.log("mintToken");
      setState((prevState) => ({ ...prevState, error: "", isLoading: true }));

      const selectedGame = games.find((e) => e.id === formValues.gameId);
      logger.log(
        account || "",
        state.tokenURI,
        formValues.gameId,
        selectedGame && selectedGame.categoryId,
        state.contentId
      );
      const txReceipt = await erc721.mintItem(
        account || "",
        state.tokenURI,
        formValues.gameId,
        selectedGame ? selectedGame.categoryId : "",
        state.contentId
      );

      const tokenId = erc721.getCreatedAssetId(txReceipt);

      if (formValues.instantSale) {
        setState((prevState) => ({
          ...prevState,
          error: "",
          tokenId,
          followStep: ECreateStep.SignSellOrder,
          isLoading: false,
          tokenMint: true,
        }));
      } else {
        await waitSeconds(5);
        history.push("/trade");
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
          erc20Address: formValues.saleToken,
          price: EthersBigNumberTo0xBigNumber(
            parseEther(formValues.salePrice.toString())
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

      history.push("/trade");
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
    <Modal disableBackdropClick onClose={onClose} open={visible}>
      <div className={clsx(classes.root, commonClasses.scroll)}>
        {state.currentStep === ECurrentStep.Loading ? (
          <CommentLoader />
        ) : (
          <>
            <div className={classes.header}>
              <Typography className={classes.title}>Follow steps</Typography>
              <IconButton className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className={classes.content}>
              {!state.initialApprovedAll && formValues.instantSale && (
                <ERC721ProgressButton
                  approved={state.approvedAll}
                  buttonDisabled={state.followStep !== ECreateStep.ApproveAll}
                  buttonLoadingText="Follow wallet instructions"
                  buttonTitle="Approve"
                  description="Approve perfoming transactions with your wallet"
                  errorText={
                    state.followStep === ECreateStep.ApproveAll
                      ? state.error
                      : ""
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
              <ERC721ProgressButton
                approved={state.filesUploaded}
                buttonDisabled={state.followStep !== ECreateStep.UploadFiles}
                buttonLoadingText="Follow wallet instructions"
                buttonTitle="Upload Files"
                description="Prepare files for minting"
                errorText={
                  state.followStep === ECreateStep.UploadFiles
                    ? state.error
                    : ""
                }
                isLoading={
                  state.followStep === ECreateStep.UploadFiles
                    ? state.isLoading
                    : false
                }
                onClick={uploadFiles}
                title={`Upload files ... ${state.filesUploadPercent}%`}
              />
              <ERC721ProgressButton
                approved={state.tokenMint}
                buttonDisabled={state.followStep !== ECreateStep.MintToken}
                buttonLoadingText="Follow wallet instructions"
                buttonTitle="Mint token"
                description="Call contract method"
                errorText={
                  state.followStep === ECreateStep.MintToken ? state.error : ""
                }
                isLoading={
                  state.followStep === ECreateStep.MintToken
                    ? state.isLoading
                    : false
                }
                onClick={mintToken}
                title="Mint token"
              />
              {formValues.instantSale && (
                <ERC721ProgressButton
                  approved={false}
                  buttonDisabled={
                    state.followStep !== ECreateStep.SignSellOrder
                  }
                  buttonLoadingText="Follow wallet instructions"
                  buttonTitle="Sign sell order"
                  description="Sign sell order using your wallet"
                  errorText={
                    state.followStep === ECreateStep.SignSellOrder
                      ? state.error
                      : ""
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
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
