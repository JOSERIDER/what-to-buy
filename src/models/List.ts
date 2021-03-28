export interface SharedList {
    users?: string[];
    products?: DataProduct[];
    name?: string;
    admin?: string;
    listCode?: string;
    color?: string;
}

export interface PrivateList{
    listCode?: string;
    name?: string;
    products?: DataProduct[];
    color?: string;
}

export interface DataProduct{
    cant?: number;
    idProduct?: string;
}