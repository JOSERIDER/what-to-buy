import { TouchIdModuleInterface } from "@/models/modules/touchID";
import { TouchIdPluginModelImp } from "@/plugins/touchID";

const touchID: TouchIdModuleInterface = new TouchIdPluginModelImp();

export default touchID;
