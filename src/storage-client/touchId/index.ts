import {
  TouchIdStorageImp,
  TouchIdStorageInterface,
  TouchIdStorageKeysInterface,
} from "@/models/storage/touchID";

const touchIdKeys: TouchIdStorageKeysInterface = {
  touchId: "TOUCH_ID_STORAGE",
};

const touchIdStorageClient: TouchIdStorageInterface = new TouchIdStorageImp(
  touchIdKeys
);

export default touchIdStorageClient;
