export interface categories {
    image?: string,
    name: string,
    subcategory?: categories[] | undefined,
    _id?: string
}

export interface categoriesAsTopic {
    image?: string,
    name: string,
    subcategory?: categories[] | [],
    _id?: string
}

export interface subCategories {
    subcategoryArray: string[],
    _id: string,
    subcategory: string,
    __v: number
}