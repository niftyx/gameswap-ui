import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";
import { IconButton, Modal, Typography, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "classnames";
import { CommentLoader } from "components";
import { IPFS_IMAGE_ENDPOINT } from "config/constants";
import { useConnectedWeb3Context, useIpfs } from "contexts";
import { BigNumber } from "ethers";
import { useContracts } from "helpers";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";
import { getLogger } from "utils/logger";

import { ECreateStep } from "../../index";
import { IFormValues } from "../ERC721CreateForm";
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
  formValues: IFormValues;
}

enum ECurrentStep {
  Loading,
  Steps,
}
interface IState {
  isLoading: boolean;
  currentStep: ECurrentStep;
  imageURI: string;
  approvedAll: boolean;
  initialApprovedAll: boolean;
  followStep: ECreateStep;
  error: string;
  filesUploaded: boolean;
  tokenMint: boolean;
  tokenURI: string;
  tokenId: BigNumber;
}

export const ERC721ProgressModal = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { ipfs } = useIpfs();
  const context = useConnectedWeb3Context();
  const { account, networkId } = context;
  const { erc721 } = useContracts(context);
  const erc721ProxyAddress = getContractAddressesForChainOrThrow(networkId || 1)
    .erc721Proxy;

  const { formValues, onClose, steps, visible } = props;
  const history = useHistory();
  const [state, setState] = useState<IState>({
    isLoading: false,
    currentStep: ECurrentStep.Loading,
    imageURI: "",
    followStep: ECreateStep.ApproveAll,
    error: "",
    approvedAll: false,
    initialApprovedAll: false,
    filesUploaded: false,
    tokenMint: false,
    tokenURI: "",
    tokenId: BigNumber.from(0),
  });

  const uploadJsonToIPFS = (value: string) =>
    new Promise<string>((resolve, reject) => {
      if (ipfs)
        ipfs.addJSON(value, (err: any, _hash: string) => {
          if (err) reject(err);
          else resolve(_hash);
        });
      else reject();
    });

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

      const imageURI = await uploadJsonToIPFS(formValues.image);

      const imageEndPoint = `${IPFS_IMAGE_ENDPOINT}${imageURI}`;

      logger.log("imageURI", imageEndPoint);

      setState((prevState) => ({
        ...prevState,
        imageURI: imageEndPoint,
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
      logger.log("UploadFiles");
      setState((prevState) => ({ ...prevState, error: "", isLoading: true }));
      const payload = {
        image: state.imageURI,
        name: formValues.name,
        description: formValues.description,
        royalties: formValues.royalties,
        attributes: formValues.attributes.slice(
          0,
          formValues.attributes.length - 1
        ),
      };
      const tokenURIHash = await uploadJsonToIPFS(JSON.stringify(payload));
      const tokenURI = `${IPFS_IMAGE_ENDPOINT}${tokenURIHash}`;
      logger.log(tokenURI);
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
      await erc721.mintItem(account || "", state.tokenURI);

      if (formValues.instantSale) {
        // get TokenId from subgraph
        const tokenId = BigNumber.from(0);
        logger.log("tokenId", tokenId);
        setState((prevState) => ({
          ...prevState,
          error: "",
          tokenId,
          followStep: ECreateStep.SignSellOrder,
          isLoading: false,
          tokenMint: true,
        }));
      } else {
        onClose();
        history.push("/trade");
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
    try {
      logger.log("signSellOrder");
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        isLoading: false,
      }));
      logger.error(error);
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
              {!state.initialApprovedAll && (
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
                title="Upload files"
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
