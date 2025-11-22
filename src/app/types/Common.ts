export interface IBaseItem {
    ID: number,
    TYPE: number,
    CREATED_ON: number
}

export interface IBaseItemWithUpdated extends IBaseItem {
    UPDATED_ON: number
}
