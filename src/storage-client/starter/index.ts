import {
  StarterStorageImp,
  StarterStorageInterface,
  StarterStorageKeysInterface,
} from "@/models/storage/starter";

const key: StarterStorageKeysInterface = {
  isSet: "STARTER_KEY_STORAGE",
};

const starterStorage: StarterStorageInterface = new StarterStorageImp(key);

export default starterStorage;
